import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/main/HomeScreen";
import SettingScreen from "../screens/main/SettingScreen";
import DeviceScreen from "../screens/main/DeviceScreen";

const Tab = createBottomTabNavigator();

export default function MainTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // ẩn tiêu đề trên đầu
                tabBarShowLabel: true, // có thể đặt false nếu chỉ muốn icon
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
            }
            )}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingScreen} />
            <Tab.Screen name="Device" component={DeviceScreen} />
        </Tab.Navigator>
    )
}