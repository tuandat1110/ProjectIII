import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { store } from "../../store/store";
import PersonalCard from "../../components/PersonalCard";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainTabParamList, RootStackParamList } from "../../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import Toast from "react-native-toast-message";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Personal'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const PersonalScreen = () => {
    const userName = store.getState().auth.user;
    const navigation = useNavigation<NavigationProp>();

    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        Toast.show({
            type: 'success',           // 'success' | 'error' | 'info'
            text1: 'Đăng xuất thành công',
            position: 'bottom',        // bottom hoặc top
            visibilityTime: 2000,      // ms
        });
    }

    const handlePress = (item: string) => {
        console.log("Bạn chọn:", item);
        if(item === "logout") {
            handleLogout();
        }
        // Ví dụ:
        // if (item === "logout") navigation.navigate("Login");
    };

    const settingsItems = [
        { id: 1, name: "Đổi mật khẩu", icon: "lock-closed-outline", action: () => handlePress("change_password") },
        { id: 2, name: "Cài đặt thông báo", icon: "notifications-outline", action: () => handlePress("notifications") },
        { id: 3, name: "Đăng xuất", icon: "log-out-outline", action: () => handlePress("logout"), color: "#e74c3c" },
    ];

    return (
        <View style={styles.container}>
            <View>
                <PersonalCard name={userName?.name} avatarUrl={userName?.avatarUrl} />
                <View style={styles.settingsContainer}>
                    {settingsItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.settingItem}
                            onPress={item.action}
                            activeOpacity={0.7}
                        >
                            <View style={styles.settingLeft}>
                                <Icon name={item.icon} size={22} color={item.color || "#4e89c7"} />
                                <Text style={[styles.settingText, item.color && { color: item.color }]}>{item.name}</Text>
                            </View>
                            <Icon name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                        ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        
    },
    settingsContainer: {
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    settingText: {
        fontSize: 16,
        color: "#333",
    },
});

export default PersonalScreen;

