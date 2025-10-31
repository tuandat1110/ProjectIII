import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import authApi from "../../api/authApi";

const { width } = Dimensions.get("window");

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const LoginScreen = () => {
    const navigation = useNavigation<MainScreenNavigationProp>();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const handleLogin = async () => {
    //   try {
    //     console.log("Attempting login with:", { email, password });
    //     const res = await fetch("http://192.168.0.102:3000/auth/login", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ email, password }),
    //     });
    //     const data = await res.json();

    //     console.log("Login response:", data);

    //     if (res.ok) {
    //       dispatch(loginSuccess({ token: data.token, user: data.user }));
    //     } else {
    //       Alert.alert("Đăng nhập thất bại", data.message);
    //     }
    //   } catch (err) {
    //     Alert.alert("Lỗi kết nối", err.message);
    //   }
    // };
    const handleLogin = async () => {
      try {
        console.log("Attempting login with:", { email, password });
        const res = await authApi.login(email, password);
        console.log("Login response:", res);

        // res ở đây là res.data từ interceptor
        if (res.data.access_token) {
          dispatch(loginSuccess({ token: res.data.access_token, user: res.data.user }));
          console.log("Token saved to store:", res.data.access_token);
        } else {
          Alert.alert("Đăng nhập thất bại", res.message || "Không xác định");
        }
      } catch (err: any) {
        Alert.alert("Lỗi kết nối", err.message || "Không xác định");
      }
    };

    return (
        <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' }}
                    style={styles.logo}
                />
            </View>

            <Text style={styles.title}>Đăng nhập</Text>

            <View style={styles.inputContainer}>
            <Icon name="email-outline" size={22} color="#4facfe" style={styles.inputIcon} />
            {/* <Icon name="rocket" size={30} color="#900" /> */}
            {/* <Fontisto name="email" color="#4facfe" size={24} /> */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
                keyboardType="email-address"
            />
            </View>

            <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#4facfe" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
                secureTextEntry
            />
            </View>

            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} activeOpacity={0.85}>
            <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}
            >
                <Icon name="login" size={22} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.loginText} onPress={handleLogin}>Đăng nhập</Text>
            </LinearGradient>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Chưa có tài khoản? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
            </View>
        </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.88,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: "#EAF6FF",
    borderRadius: 60,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dce9f9",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    color: "#4facfe",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 18,
  },
  loginGradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  signupText: {
    color: "#777",
    fontSize: 14,
  },
  signupLink: {
    color: "#4facfe",
    fontWeight: "600",
    fontSize: 14,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});

export default LoginScreen;
