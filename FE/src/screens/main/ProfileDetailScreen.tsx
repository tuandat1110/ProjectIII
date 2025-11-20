import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store"; // Giả định đường dẫn
import { useNavigation } from '@react-navigation/native';

// Màu sắc tương thích
const PRIMARY_BLUE = '#4e89c7'; 
const BACKGROUND_LIGHT = '#F5F5F5';
const TEXT_DARK = '#333333';
const BORDER_COLOR = '#E0E0E0';

const ProfileDetailScreen = () => {
    const user = useSelector((state: RootState) => state.auth.user); 
    const userName = user?.name || "Người dùng ABC";
    const userEmail = user?.email || "user.abc@example.com";
    
    const navigation = useNavigation();

    // Hàm xử lý nút chỉnh sửa
    const handleEditProfile = () => {
        // Thêm logic điều hướng tới màn hình chỉnh sửa hoặc mở Modal
        console.log("Mở giao diện chỉnh sửa profile");
    };

    return (
        <View style={styles.container}>
            
            {/* Header: Nút Back và Nút Chỉnh sửa */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={TEXT_DARK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
                <TouchableOpacity onPress={handleEditProfile}>
                    <Icon name="create-outline" size={24} color={PRIMARY_BLUE} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Khu vực Ảnh đại diện và Tên */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/100/4e89c7/FFFFFF?text=A' }} // Ảnh mặc định
                        style={styles.avatar}
                    />
                    <Text style={styles.displayName}>{userName}</Text>
                    <Text style={styles.joinedText}>Thành viên từ 2023</Text>
                </View>

                {/* Danh sách Thông tin Chi tiết */}
                <View style={styles.infoContainer}>
                    <InfoRow icon="mail-outline" label="Email" value={userEmail} />
                    <InfoRow icon="person-outline" label="Tên người dùng" value={userName} />
                    <InfoRow icon="call-outline" label="Số điện thoại" value="Chưa cập nhật" />
                    <InfoRow icon="location-outline" label="Địa chỉ" value="Việt Nam" />
                </View>

            </ScrollView>
        </View>
    );
}

// Component phụ cho từng dòng thông tin
const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={22} color={PRIMARY_BLUE} style={styles.infoIcon} />
        <View style={styles.infoTextGroup}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_LIGHT, 
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: TEXT_DARK,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    // --- Profile Section ---
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: PRIMARY_BLUE,
    },
    displayName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: TEXT_DARK,
    },
    joinedText: {
        fontSize: 14,
        color: 'gray',
    },
    // --- Info Container ---
    infoContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    infoIcon: {
        marginRight: 15,
    },
    infoTextGroup: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: 'gray',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: TEXT_DARK,
    },
});

export default ProfileDetailScreen;