import { FlatList, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { useEffect, useState, useRef } from "react";
import socket from "../../socket/socket";
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import RoomCard from "../../components/RoomCard";
import Icon from "react-native-vector-icons/Ionicons";
import { House } from "../../types/house";
import { useAddRoom, useGetRooms } from "../../hooks/useRooms";
import { AppState } from "react-native";

const HomeScreen = () => {
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
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [image, setImage] = useState("");

  const appState = useRef(AppState.currentState);
  const latestPayload = useRef(null);

  const currentSelectedId = useSelector((state: RootState) => state.house.selectedHomeId);
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { mutate, isPending } = useAddRoom(currentSelectedId as string);

  const { data: rooms, isLoading, error } = useGetRooms(currentSelectedId as string);

  console.log(`Current home: ${currentSelectedId}`);
  const removePrefix = (name: string) => {
    if (!name) return "";
    return name
      .replace(/^(Phường|Xã|Thị trấn|Quận|Huyện|Thành phố|Tỉnh|Thị xã)\s*/gi, "")
      .trim();
  };

  const handleAddRoom = () => {
    setOpen(true);
  };

  const handleSave = () => {
    if(!roomName.trim() || !currentSelectedId) {
        return;
    }
    mutate({houseId: currentSelectedId,roomData: { name: roomName, description: descriptionText, image: image }}, {
        onSuccess: () => {
            setRoomName("");
            setDescriptionText("");
            setImage("");
        },
        onError: (err) => {
            console.error("LỖI API:", err);
            // Hiển thị thông báo lỗi cho người dùng
        }
    })
    setOpen(false);
  }

  // Lấy dữ liệu cảm biến qua WebSocket
  useEffect(() => {
    const handleAppStateChange = (nextAppState:  "active" | "background" | "inactive") => {
      // Khi app từ background -> foreground, render dữ liệu mới nhất
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        latestPayload.current
      ) {
        const { temperature, humidity } = latestPayload.current.payload;
        setData({ temperature, humidity });
        setDescription(generateDescription(temperature, humidity));
      }
      appState.current = nextAppState;
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    socket.on("connect", () => console.log("Connected to WebSocket server"));
    let lastRenderTime = 0;
    socket.on("sensor_data", (payload) => {
      latestPayload.current = payload;
      if (appState.current === "active") {
        const now = Date.now();
        if (now - lastRenderTime > 1000) { // render max 1 lần / giây
          const { temperature, humidity } = payload.payload;
          setData({ temperature, humidity });
          setDescription(generateDescription(temperature, humidity));
          lastRenderTime = now;
        }
      }
    });
    socket.on("disconnect", () => console.log("Disconnected from server"));

    return () => {
      socket.off("sensor_data");
      socket.disconnect();
      appStateListener.remove();
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
      <Modal
        transparent={true}
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
            <View style={styles.modalBox}>
                <Text style={styles.title}>Thêm phòng mới</Text>
                <TextInput
                    placeholder="Nhập tên phòng..."
                    placeholderTextColor="black"
                    value={roomName}
                    onChangeText={setRoomName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Nhập mô tả cho phòng ..."
                    placeholderTextColor="black"
                    value={descriptionText}
                    onChangeText={setDescriptionText}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Nhập đường dẫn ảnh cho phòng..."
                    placeholderTextColor="black"
                    value={image}
                    onChangeText={setImage}
                    style={styles.input}
                />
                
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => setOpen(false)}
                        style={[styles.btn, { backgroundColor: "#ccc" }]}
                    >
                        <Text>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.btn, { backgroundColor: "#007AFF" }]}
                    >
                        <Text style={{ color: "#fff" }}>Lưu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <FlatList
          data={[...(rooms || []), { id: "add_button" }]}
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
})

export default HomeScreen;


