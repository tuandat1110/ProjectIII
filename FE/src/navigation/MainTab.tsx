import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/main/HomeScreen";
import DeviceScreen from "../screens/main/DeviceScreen";
import NotificationScreen from "../screens/main/NotificationScreen";
import PersonalScreen from "../screens/main/PersonalScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../components/Header";

const Tab = createBottomTabNavigator();

export default function MainTab() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    height: 60,
                    borderRadius: 20,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Device') {
                        iconName = focused ? 'bulb' : 'bulb-outline';
                    } else if (route.name === 'Notification') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Personal') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    header: () => <Header title="Home" nameIcon="home-outline" />,
                }}
            />

            <Tab.Screen
                name="Device"
                component={DeviceScreen}
                options={{
                    header: () => <Header title="Device" nameIcon="bulb-outline" />,
                }}
            />

            {/* Nút voice ở giữa */}
            <Tab.Screen
                name="VoiceButton"
                component={() => null}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            style={styles.voiceWrapper}
                            activeOpacity={0.85}
                            onPress={() => console.log("Voice button pressed")}
                        >
                            <View style={styles.voiceButton}>
                                <Ionicons name="mic" size={28} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />


            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    header: () => <Header title="Notification" nameIcon="notifications-outline" />,
                }}
            />

            <Tab.Screen
                name="Personal"
                component={PersonalScreen}
                options={{
                    header: () => <Header title="Personal" nameIcon="settings-outline" />,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    voiceWrapper: {
        top: -20, // nổi lên khỏi tab bar
        justifyContent: 'center',
        alignItems: 'center',
    },
    voiceButton: {
        width: 60,
        height: 60,
        borderRadius: 34,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',

        // hiệu ứng shadow đẹp hơn
        shadowColor: '#007AFF',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,

        // viền mờ nhẹ (tạo cảm giác 3D)
        borderWidth: 3,
        borderColor: '#E8F0FE',
    },
});
