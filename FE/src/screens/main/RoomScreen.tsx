import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Kích thước màn hình để tính toán chiều rộng cho card
const { width } = Dimensions.get('window');

// Màu sắc tương thích với màn hình Home ban đầu của bạn
const PRIMARY_BLUE = '#4e89c7'; // Màu xanh chủ đạo (Gần màu trong Text "Tất cả các phòng")
const BACKGROUND_LIGHT = '#F5F5F5'; // Nền nhẹ
const CARD_BACKGROUND = '#FFFFFF';
const TEXT_DARK = '#333333';
const ACCENT_ORANGE = '#FF7F00'; // Màu cam cho nút ON/OFF (như trong mẫu)

// Dữ liệu giả định cho các thiết bị
const devicesData = [
    { name: 'Lamp', status: '70%', icon: 'bulb-outline', color: '#000000', isOn: false },
    { name: 'Smart TV', status: 'On', icon: 'tv-outline', color: '#000000', isOn: true },
    { name: 'Door', status: 'Lock', icon: 'lock-closed-outline', color: '#000000', isOn: false },
    { name: 'AC', status: '18°', icon: 'snow-outline', color: '#000000', isOn: true },
    { name: 'Wi-Fi', status: 'Off', icon: 'wifi-outline', color: '#000000', isOn: false },
];

// Component Card Thiết bị
const DeviceCard = ({ device }) => {
    // Nếu là nút "Add Device"
    if (device.name === 'Add Device') {
        return (
            <TouchableOpacity style={styles.deviceCard}>
                <View style={styles.addIconContainer}>
                    <Icon name="add" size={30} color={PRIMARY_BLUE} />
                </View>
                <Text style={styles.addText}>Add Device</Text>
            </TouchableOpacity>
        );
    }
    
    return (
        <TouchableOpacity style={styles.deviceCard}>
            {/* Icon Thiết bị */}
            <Icon name={device.icon} size={30} color={TEXT_DARK} style={{ marginBottom: 5 }} />

            {/* Nút Nguồn (On/Off) */}
            <TouchableOpacity style={styles.powerButton}>
                <Icon name="power" size={18} color={device.isOn ? ACCENT_ORANGE : '#CCCCCC'} />
            </TouchableOpacity>

            {/* Thông tin */}
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{device.name}</Text>
                <Text style={styles.cardSubtitle}>{device.status}</Text>
            </View>
        </TouchableOpacity>
    );
}

const RoomScreen = () => {
    // Thêm nút "Add Device" vào cuối danh sách
    const displayDevices = [...devicesData, { name: 'Add Device', id: 'add' }];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { /* navigation.goBack() */ }}>
                    <Icon name="arrow-back" size={24} color={TEXT_DARK} />
                </TouchableOpacity>
                <Text style={styles.roomTitle}>Bedroom</Text>
                <TouchableOpacity>
                    <Icon name="ellipsis-vertical" size={24} color={TEXT_DARK} />
                </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Usage Section (Giả định về Biểu đồ) */}
                <View style={styles.usageContainer}>
                    <Text style={styles.usageLabel}>Usage Today</Text>
                    <Text style={styles.usageValue}>46 kWh</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.chartText}>[Biểu đồ sử dụng điện ở đây]</Text>
                        <View style={styles.chartCenter}>
                             <Text style={styles.chartKwh}>28 kWh</Text>
                        </View>
                    </View>
                </View>

                {/* Grid Thiết bị */}
                <View style={styles.deviceGrid}>
                    {displayDevices.map((device, index) => (
                        <DeviceCard key={index} device={device} />
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
        paddingTop: 40,
    },
    // --- Header ---
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
        color: TEXT_DARK,
    },
    // --- Usage Chart ---
    usageContainer: {
        backgroundColor: CARD_BACKGROUND, 
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(78, 137, 199, 0.1)', // Nền hơi xanh
        borderColor: PRIMARY_BLUE,
        borderWidth: 0,
        paddingBottom: 40,
    },
    usageLabel: {
        fontSize: 16,
        color: TEXT_DARK,
        fontWeight: '500',
    },
    usageValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: TEXT_DARK,
        alignSelf: 'flex-end',
        marginTop: -20,
    },
    chartPlaceholder: {
        height: 100,
        marginTop: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartCenter: {
         position: 'absolute',
         top: 30,
    },
    chartKwh: {
        fontSize: 14,
        color: TEXT_DARK,
        fontWeight: 'bold',
    },
    chartText: {
        color: PRIMARY_BLUE,
        fontStyle: 'italic',
        opacity: 0.7
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
    }
});

export default RoomScreen;