import { PermissionsAndroid, Platform, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { useEffect, useState } from "react";
import socket from "../../socket/socket";
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const HomeScreen = () => {
  const [data, setData] = useState({ temperature: 0, humidity: 0 });
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [nameLocation, setNameLocation] = useState("");

  const email = useSelector((state: RootState) => state.auth.email);

  // Lấy dữ liệu cảm biến qua WebSocket
  useEffect(() => {
    socket.on("connect", () => console.log("Connected to WebSocket server"));
    socket.on("sensor_data", (payload) => {
      const { temperature, humidity } = payload.payload;
      setData({ temperature, humidity });
      setDescription(generateDescription(temperature, humidity));
    });
    socket.on("disconnect", () => console.log("Disconnected from server"));

    return () => {
      socket.off("sensor_data");
      socket.disconnect();
    };
  }, []);

  // Lấy vị trí GPS
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Quyền vị trí bị từ chối');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          setLocation(pos.coords);
          console.log('Location:', pos.coords);
        },
        (error) => {
          console.log('Error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    })();
  }, []);

  // Lấy tên thành phố sau khi có tọa độ
  useEffect(() => {
    if (location) {
      getCityName(location.latitude, location.longitude);
    }
  }, [location]);

  const getCityName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: {
            "User-Agent": `ReactNativeApp/1.0 (${email})`, // bắt buộc
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);
  
      const address = data.address;

      const village = address.village || address.suburb || "";
      const town = address.town || address.county || "";
      const city_district = address.city_district || "";
      const city = address.city || address.state || "";
      const country = address.country || "";

      const fullLocation = [village, town,city_district, city, country].filter(Boolean).join(", ");

      setNameLocation(fullLocation);
      console.log("Địa chỉ:", fullLocation);
    } catch (error) {
      console.log("Lỗi lấy tên vị trí:", error);
    }
  };

  // Sinh mô tả dựa theo nhiệt độ và độ ẩm
  const generateDescription = (temp, hum) => {
    if (temp < 20) return "Trời lạnh, nhớ mặc ấm nhé!";
    if (temp >= 20 && temp <= 30) {
      if (hum > 80) return "Thời tiết mát mẻ nhưng hơi ẩm, có thể mưa.";
      if (hum < 40) return "Thời tiết dễ chịu nhưng hơi khô.";
      return "Thời tiết đẹp, mát mẻ.";
    }
    if (temp > 30) {
      if (hum > 70) return "Trời oi bức, có thể mưa giông.";
      return "Trời nóng, nhớ uống nước nhiều nhé!";
    }
    return "Dữ liệu thời tiết đang cập nhật...";
  };

  return (
    <View>
      <WeatherCard
        city={nameLocation || "Đang xác định vị trí..."}
        temperature={data.temperature}
        description={description}
        humidity={data.humidity}
      />
    </View>
  );
};

export default HomeScreen;
