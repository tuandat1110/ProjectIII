import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"; 
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from '../../store/authSlice';
import profileApi from '../../api/profileApi';

const PRIMARY_BLUE = '#4e89c7'; 
const BACKGROUND_LIGHT = '#F5F5F5';
const TEXT_DARK = '#333333';
const BORDER_COLOR = '#E0E0E0';

const UpdateProfileScreen = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        gender: user?.gender || "MALE",
        dateOfBirth: user?.dateOfBirth || ""
    });

    const handleUpdate = async () => {
        try {
            const response = await profileApi.updateProfile(user?.id as number, formData);
            dispatch(updateProfile(response.data));
            Alert.alert("Thành công", "Cập nhật thông tin thành công");
            navigation.goBack();
        } catch (err) {
            Alert.alert("Lỗi", "Không thể cập nhật thông tin");
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close-outline" size={28} color={TEXT_DARK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                <TouchableOpacity onPress={handleUpdate}>
                    <Text style={styles.saveBtn}>Lưu</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.inputContainer}>
                    <InputGroup 
                        icon="person-outline" 
                        label="Họ và tên" 
                        value={formData.name}
                        onChangeText={(txt) => setFormData({...formData, name: txt})}
                    />
                    
                    <View style={styles.genderContainer}>
                        <View style={styles.genderHeader}>
                            <Icon name="transgender-outline" size={20} color={PRIMARY_BLUE} />
                            <Text style={styles.labelInside}>Giới tính</Text>
                        </View>
                        <View style={styles.genderOptions}>
                            <TouchableOpacity 
                                style={[styles.genderBtn, formData.gender === "MALE" && styles.genderBtnActive]}
                                onPress={() => setFormData({...formData, gender: "MALE"})}
                            >
                                <Text style={[styles.genderText, formData.gender === "MALE" && styles.genderTextActive]}>Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.genderBtn, formData.gender === "FEMALE" && styles.genderBtnActive]}
                                onPress={() => setFormData({...formData, gender: "FEMALE"})}
                            >
                                <Text style={[styles.genderText, formData.gender === "FEMALE" && styles.genderTextActive]}>Nữ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <InputGroup 
                        icon="calendar-outline" 
                        label="Ngày sinh (YYYY-MM-DD)" 
                        value={formData.dateOfBirth}
                        onChangeText={(txt) => setFormData({...formData, dateOfBirth: txt})}
                        placeholder="2000-01-01"
                    />

                    <InputGroup 
                        icon="call-outline" 
                        label="Số điện thoại" 
                        value={formData.phone}
                        keyboardType="phone-pad"
                        onChangeText={(txt) => setFormData({...formData, phone: txt})}
                    />

                    <InputGroup 
                        icon="location-outline" 
                        label="Địa chỉ" 
                        value={formData.address}
                        multiline
                        onChangeText={(txt) => setFormData({...formData, address: txt})}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const InputGroup = ({ icon, label, value, onChangeText, keyboardType = "default", multiline = false, placeholder = "" }) => (
    <View style={styles.inputRow}>
        <Icon name={icon} size={22} color={PRIMARY_BLUE} style={styles.inputIcon} />
        <View style={styles.inputFieldGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[styles.textInput, multiline && { height: 60, textAlignVertical: 'top' }]}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
                placeholder={placeholder}
                placeholderTextColor="#999"
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_LIGHT,
    },
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
    saveBtn: {
        fontSize: 16,
        fontWeight: '600',
        color: PRIMARY_BLUE,
    },
    scrollContent: {
        padding: 15,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    inputIcon: {
        marginTop: 12,
        marginRight: 15,
    },
    inputFieldGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 4,
    },
    textInput: {
        fontSize: 16,
        color: TEXT_DARK,
        padding: 0,
        fontWeight: '500',
    },
    genderContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    genderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelInside: {
        fontSize: 12,
        color: 'gray',
        marginLeft: 15,
    },
    genderOptions: {
        flexDirection: 'row',
        marginLeft: 37,
    },
    genderBtn: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        marginRight: 10,
    },
    genderBtnActive: {
        backgroundColor: PRIMARY_BLUE,
        borderColor: PRIMARY_BLUE,
    },
    genderText: {
        color: TEXT_DARK,
    },
    genderTextActive: {
        color: 'white',
        fontWeight: '600',
    },
});

export default UpdateProfileScreen;