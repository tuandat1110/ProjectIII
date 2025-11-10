import { FlatList, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { useEffect, useState } from "react";
import socket from "../../socket/socket";
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import RoomCard from "../../components/RoomCard";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const roomsData = [
    { id: "1", name: "Master Bedroom", devices: 4, image: "https://picsum.photos/200/150?1", isOn: true },
    { id: "2", name: "Living Room", devices: 15, image: "https://picsum.photos/200/150?2", isOn: false },
    { id: "3", name: "Kitchen", devices: 8, image: "https://picsum.photos/200/150?3", isOn: true },
    { id: "4", name: "Office", devices: 6, image: "https://picsum.photos/200/150?4", isOn: false },
    { id: "5", name: "Guest Room", devices: 3, image: "https://picsum.photos/200/150?5", isOn: false },
    { id: "6", name: "Bathroom", devices: 2, image: "https://picsum.photos/200/150?6", isOn: true },
    { id: "7", name: "Garage", devices: 5, image: "https://picsum.photos/200/150?7", isOn: false },
  ];

  const [rooms, setRooms] = useState(roomsData);

  // const toggleSwitch = (id) => {
  //   setRooms((prevRooms) =>
  //     prevRooms.map((room) =>
  //       room.id === id ? { ...room, isOn: !room.isOn } : room
  //     )
  //   );
  // };

  const [data, setData] = useState({ temperature: 0, humidity: 0 });
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [nameLocation, setNameLocation] = useState("");

  const email = useSelector((state: RootState) => state.auth.user?.email);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const removePrefix = (name: string) => {
    if (!name) return "";
    return name
      .replace(/^(Phường|Xã|Thị trấn|Quận|Huyện|Thành phố|Tỉnh|Thị xã)\s*/gi, "")
      .trim();
  };

  const handleAddRoom = () => {
    console.log("Thêm phòng mới");
    // Ở đây bạn có thể mở modal nhập thông tin phòng
  };

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
      const address = data.address;

      const village = removePrefix(address.village || address.suburb || "");
      const town = removePrefix(address.town || address.county || "");
      const city_district = removePrefix(address.city_district || "");
      const city = removePrefix(address.city || address.state || "");
      //const country = address.country || "";

      const fullLocation = [village, town,city_district, city].filter(Boolean).join(", ");

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
    <View style={{ flex: 1}}>
      <TouchableOpacity
         activeOpacity={0.7}
      >
        <WeatherCard
          city={nameLocation || "Đang xác định vị trí..."}
          temperature={data.temperature}
          description={description}
          humidity={data.humidity}
        />
      </TouchableOpacity>
      <Text style={styles.allRoom}>
        Tất cả các phòng
      </Text>
      <View style={styles.container}>
        <FlatList
          data={[...rooms, { id: "add_button" }]}
          renderItem={({ item }) => 
            item.id === "add_button" ? (
              <TouchableOpacity style={styles.addCard} onPress={handleAddRoom}>
                <Icon name="add" size={40} color="#007AFF" />
                <Text style={styles.addText}>Thêm phòng</Text>
              </TouchableOpacity>
            ) : (
            <RoomCard room={item} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  allRoom: {
    marginHorizontal: 16,
    color: '#4e89c7ff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  addCard: {
    width: "48%",
    height: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#007AFF",
  },
  addText: {
    marginTop: 8,
    color: "#007AFF",
    fontWeight: "bold",
  },
})

export default HomeScreen;
