import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/main/HomeScreen";
import SettingScreen from "../screens/main/SettingScreen";
import DeviceScreen from "../screens/main/DeviceScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from "react-native";
import Header from "../components/Header";


const Tab = createBottomTabNavigator();

export default function MainTab() {
    function alert(arg: string): void {
        throw new Error("Function not implemented.");
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true, // ẩn tiêu đề trên đầu
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
                tabBarIcon: ({ focused, color, size}) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Device') {
                        iconName = focused ? 'bulb' : 'bulb-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            }
            )}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                    header: () => <Header title="Home" nameIcon="home-outline"/>,
                }}
            />
            <Tab.Screen 
                name="Settings" 
                component={SettingScreen} 
                options={{
                    header: () => <Header title="Settings" nameIcon="settings-outline"/>
                }}
            />
            <Tab.Screen 
                name="Device" 
                component={DeviceScreen} 
                options={{
                    header: () => <Header title="Device" nameIcon="bulb-outline"/>
                }}
            />
        </Tab.Navigator>
    )
}