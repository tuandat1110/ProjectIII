import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons"


interface IHeader {
    title: string,
    nameIcon: string,
}

const Header = ( {title, nameIcon}: IHeader) => {
    const [visible, setVisible] = useState(false);
    const [selectedHome, setSelectedHome] = useState("Nhà chính");
    const [homeName, setHomeName] = useState("");
    const [visibleForAddHome, setVisibleForAddHome] = useState(false);

    const handleSave = () => {
        console.log("Tên nhà:", homeName);
        setVisible(false);
    };

    const homes = ["Nhà chính", "Nhà trọ", "Nhà ba mẹ", "Nhà Đà Lạt"];

    const handleSelect = (home: string) => {
        setSelectedHome(home);
        setVisible(false);
    };
    return (
        <View
            style={{
                backgroundColor: '#fff',
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                borderBottomRightRadius: 30,
                borderBottomLeftRadius: 30,
            }}
        >
            <TouchableOpacity 
                style={{
                    flexDirection: 'row',
                    gap: 5,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={() => setVisible(true)}
            >
                <Text style={{ color: '#4e89c7ff', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                <Icon name="chevron-down" size={24} color="#4e89c7ff"  style={{marginTop: 4}}/>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="fade"
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={homes}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => handleSelect(item)}
                                    >
                                    <Icon
                                        name={
                                        item === selectedHome
                                            ? "home"
                                            : "home-outline"
                                        }
                                        size={20}
                                        color={item === selectedHome ? "#007AFF" : "#555"}
                                    />
                                    <Text
                                        style={[
                                        styles.itemText,
                                        {
                                            color:
                                            item === selectedHome ? "#007AFF" : "#333",
                                            fontWeight: item === selectedHome ? "bold" : "400",
                                        },
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity>
                <Ionicons name={nameIcon} size={24} color="#4e89c7ff" onPress={() => setVisibleForAddHome(true)}/>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="fade"
                visible={visibleForAddHome}
                onRequestClose={() => setVisibleForAddHome(false)}
            >
                <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Thêm nhà mới</Text>

                    <TextInput
                        placeholder="Nhập tên nhà..."
                        value={homeName}
                        onChangeText={setHomeName}
                        style={styles.input}
                    />

                    <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => setVisibleForAddHome(false)}
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
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
    marginRight: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "80%",
    paddingVertical: 8,
    elevation: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
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
});

export default Header;