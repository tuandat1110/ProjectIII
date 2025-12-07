import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image, Modal, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from '../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Room } from '../../types/room';
import { useAddDevice, useControlDevice, useGetDevices } from '../../hooks/useDevice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import socket from '../../socket/socket';
import { useQueryClient } from '@tanstack/react-query';
import { roomKeys } from '../../queryKeys';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const PRIMARY_BLUE = '#4e89c7ff'; 
const BACKGROUND_LIGHT = '#F5F5F5'; 
const CARD_BACKGROUND = '#FFFFFF';
const TEXT_DARK = '#333333';
const ACCENT_ORANGE = '#FF7F00';

const TYPE_DATA = [
    { label: 'Đèn', value: 'light' },
    { label: 'Quạt', value: 'fan' },
    { label: 'Điều hòa', value: 'ac' },
    { label: 'Tivi', value: 'tv' },
    { label: 'Cửa cuốn', value: 'door' },
]

const DeviceCard = memo(({ device, roomId }) => {
    const controlDevice = useControlDevice();
    const queryClient = useQueryClient();
    const mac = useSelector((state: RootState) => state.house.macAddress); 
    const [open, setOpen] = React.useState(false);
    const [deviceName, setDeviceName] = React.useState('');
    const [pin, setPin] = React.useState('');
    const [selectedRoom, setSelectedRoom] = React.useState(TYPE_DATA[0].value);
    const { mutate, isPending } = useAddDevice(roomId);

    useEffect(() => {
        const handleDeviceUpdate = (payload) => {
            const { deviceId, pin, status, updatedAt } = payload;
            if(deviceId && pin) {
                queryClient.invalidateQueries({ queryKey: roomKeys.devices(roomId) });
            }
        };

        socket.on("device_state_updated", handleDeviceUpdate);

        return () => {
            socket.off("device_state_updated", handleDeviceUpdate); // cleanup khi unmount
        };
    }, [roomId]);


    const handleToggle = useCallback(() => {
        const payload = {
            status: device.status === true ? "OFF" : "ON",
            deviceId: device.id,
            pin: device.pin,
            mac: mac,
            roomId: String(roomId)
        };
        console.log(`Payload: ${JSON.stringify(payload)}`);
        controlDevice.mutate(payload);
    },[device.status, device.id, device.pin, mac, roomId]);

    const handleSave = () => {
        if(!deviceName.trim() || !pin.trim()) {
            return;
        }
        mutate({ name: deviceName, pin, type: selectedRoom, status: false, ipAddress: ''}, {
            onSuccess: () => {
                setDeviceName('');
                setPin('');
            },
            onError: (error) => {
                console.error("Lỗi khi thêm thiết bị:", error);
            }
        });
        setOpen(false);
    }
    
    if (device.name === "add_button") {
        return (
            <>
            <Modal
                transparent={true}
                animationType="fade"
                visible={open}
                onRequestClose={() => setOpen(false)}
                >
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.title}>Thêm thiết bị mới</Text>
                        <TextInput
                            placeholder="Nhập tên thiết bị..."
                            placeholderTextColor="black"
                            value={deviceName}
                            onChangeText={setDeviceName}
                            style={styles.input}
                        />
                        <View style={styles.pickerContainer}>
                            <Text style={styles.label}>Loại thiết bị</Text>

                            <View style={styles.pickerBox}>
                                <Picker
                                    selectedValue={selectedRoom}
                                    onValueChange={setSelectedRoom}
                                    dropdownIconColor="#4e89c7ff"
                                    style={styles.picker}
                                >
                                    {TYPE_DATA.map((item) => (
                                        <Picker.Item
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <TextInput
                            placeholder="Nhập chân pin..."
                            placeholderTextColor="black"
                            value={pin}
                            onChangeText={setPin}
                            style={styles.input}
                            keyboardType="numeric"
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
                <TouchableOpacity style={styles.deviceCard} onPress={() => setOpen(!open)}>
                    <View style={styles.addIconContainer}>
                        <Icon name="add" size={30} color={PRIMARY_BLUE} />
                    </View>
                    <Text style={styles.addText}>Thêm thiết bị</Text>
                </TouchableOpacity>
            </>
        );
    }
    
    return (
        <TouchableOpacity style={styles.deviceCard} onPress={handleToggle}>
            <Icon name="bulb-outline" size={30} color={TEXT_DARK} style={{ marginBottom: 5 }} />
            <TouchableOpacity style={styles.powerButton}>
                <Icon name="power" size={18} color={device.status ? ACCENT_ORANGE : '#CCCCCC'} />
            </TouchableOpacity>
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{device.name}</Text>
                <Text style={styles.cardSubtitle}>{device.status}</Text>
            </View>
        </TouchableOpacity>
    );
});

const RoomScreen = () => {
    const route = useRoute();
    const room: Room = route.params;
    const navigation = useNavigation();
    const { data: devices, isPending } = useGetDevices(room.id as string);

    const sortedDevices = useMemo(() => {
        if (!devices) return [];
        return [...devices].sort((a, b) => String(a.id).localeCompare(String(b.id))); 
    }, [devices]);

    const devicesAndAddButton = useMemo(() => {
        return [...sortedDevices, { name: "add_button" }];
    }, [sortedDevices]);
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={PRIMARY_BLUE} />
                </TouchableOpacity>
                <Text style={styles.roomTitle}>{room.name}</Text>
                <TouchableOpacity>
                    <Icon name="ellipsis-vertical" size={24} color={PRIMARY_BLUE} />
                </TouchableOpacity>
            </View>   
            {room.image ? (
                <View style={styles.roomImageContainer}>
                    <Image
                        source={{ uri: room.image }}
                        style={styles.roomImage}
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <View style={styles.roomImageContainer}>
                    <Image
                        source={
                            require('../../assets/livingroom.png')  
                        }
                        style={styles.roomImage}
                        resizeMode="cover"
                    />
                </View> )
            } 
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.deviceGrid}>
                    {isPending && <Text>Đang tải thiết bị...</Text>}
                    {!isPending && devicesAndAddButton.map((device) => (
                        <DeviceCard 
                            key={device.id || 'add_button'} 
                            device={device} 
                            roomId={room.id} 
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_LIGHT, 
        paddingHorizontal: 15,
        paddingTop: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    roomTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: PRIMARY_BLUE,
    },
    // --- Device Grid ---
    deviceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    deviceCard: {
        width: (width - 45) / 2, // 45 = 15*3 (padding/margin)
        height: 120,
        backgroundColor: CARD_BACKGROUND,
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        elevation: 2,
        position: 'relative',
        justifyContent: 'space-between',
    },
    powerButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: BACKGROUND_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        marginTop: 'auto',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: TEXT_DARK,
    },
    cardSubtitle: {
        fontSize: 12,
        color: 'gray',
    },
    // --- Add Device Card ---
    addIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: PRIMARY_BLUE,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    addText: {
        fontSize: 16,
        fontWeight: '600',
        color: PRIMARY_BLUE,
    },
    roomImageContainer: {
        width: '100%',
        height: 150,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 15,
        backgroundColor: '#ddd'
    },

    roomImage: {
        width: '100%',
        height: '100%'
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
    pickerContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: '#333',
        fontWeight: '600'
    },

    pickerBox: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
        overflow: 'hidden',
        height: 55,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },

    picker: {
        width: '100%',
        height: 55,
        color: '#333',
        fontSize: 16,
    },

});

export default RoomScreen;