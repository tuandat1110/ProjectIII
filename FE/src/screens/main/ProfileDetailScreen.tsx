import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"; // Giả định đường dẫn
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../utils/utils';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { uploadAvatarApi } from '../../api/uploadApi';
import { updateAvatar } from '../../store/authSlice';
import userApi from '../../api/userApi';
import profileApi from '../../api/profileApi';

// Màu sắc tương thích
const PRIMARY_BLUE = '#4e89c7'; 
const BACKGROUND_LIGHT = '#F5F5F5';
const TEXT_DARK = '#333333';
const BORDER_COLOR = '#E0E0E0';

const ProfileDetailScreen = () => {
    const user = useSelector((state: RootState) => state.auth.user); 
    const userName = user?.name || "Người dùng ABC";
    const userEmail = user?.email || "user.abc@example.com";
    const userPhone = user?.phone || "Chưa cập nhật";
    const userAddress = user?.address || "Chưa cập nhật";
    const userDateOfBirth = user?.dateOfBirth || "Chưa cập nhật";
    const userGender = user?.gender || "Chưa cập nhật";
    console.log(`user: ${JSON.stringify(user)}`);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const [avatarSource, setAvatarSource] = useState(user?.avatarUrl);
    const handleSelectImage = async () => {
        const options: ImageLibraryOptions = {
            mediaType: "photo",
            quality: 0.8,
        };

        const result = await launchImageLibrary(options);

        if (!result.assets || result.assets.length === 0) return;

        const asset = result.assets[0];

        const file = {
            uri: asset.uri!.startsWith("file://")
                ? asset.uri!
                : "file://" + asset.uri!,
            type: asset.type || "image/jpeg",
            name: asset.fileName || "avatar.jpg",
        };

        try {
            const uploadRes = await uploadAvatarApi(file, token);
            const avatarUrl = uploadRes.data.url;
            await profileApi.updateAvatar(user?.id as number,avatarUrl);
            dispatch(updateAvatar({ avatarUrl }));
            setAvatarSource(avatarUrl);
        } catch (err) {
           if (err.response) {
                // Server trả về lỗi (400, 500, ...)
                console.log("Data:", err.response.data);
                console.log("Status:", err.response.status);
            } else if (err.request) {
                // Yêu cầu đã gửi nhưng không nhận được phản hồi (Lỗi mạng/IP)
                console.log("Request:", err.request);
            } else {
                console.log("Error Message:", err.message);
            }
        }
    };
    // Hàm xử lý nút chỉnh sửa
    const handleEditProfile = () => {
        // Thêm logic điều hướng tới màn hình chỉnh sửa hoặc mở Modal
        navigation.navigate('UpdateProfileScreen');
    };

    const role = user?.role === "USER" ? "Thành viên" : "Người quản trị";
    const date = formatDate(user?.createdAt as unknown as string);
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
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: avatarSource || 'https://via.placeholder.com/100/4e89c7/FFFFFF?text=A' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity onPress={handleSelectImage} style={styles.pencilIcon}>
                            <Icon name="pencil-outline" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.displayName}>{userName}</Text>
                    <Text style={styles.joinedText}>{`${role} từ ${date}`}</Text>
                </View>



                {/* Danh sách Thông tin Chi tiết */}
                <View style={styles.infoContainer}>
                    <InfoRow icon="mail-outline" label="Email" value={userEmail} />
                    <InfoRow icon="person-outline" label="Tên người dùng" value={userName} />
                    <InfoRow icon="transgender-outline" label="Giới tính" value={userGender === "MALE" ? "Nam" : "Nữ"} />
                    <InfoRow icon="calendar-outline" label="Ngày sinh" value={formatDate(userDateOfBirth as string)} />
                    <InfoRow icon="call-outline" label="Số điện thoại" value={userPhone} />
                    <InfoRow icon="location-outline" label="Địa chỉ" value={userAddress} />
                    
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
    pencilIcon: {
        backgroundColor: "#4facfe",
        borderRadius: 20,        
        padding: 4,                           
        justifyContent: "center", 
        alignItems: "center",
        position: 'absolute',
        bottom: 8,                
        right: 5,    
    },
    avatarContainer: {
        position: 'relative', 
        marginBottom: 10,
    },
});

export default ProfileDetailScreen;
