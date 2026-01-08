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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import authApi from "../../api/authApi";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const RegisterScreen = () => {
    const navigation = useNavigation<SignupScreenNavigationProp>();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleRegister = async () => {
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
        return;
      }

      try {
        const res = await authApi.signup({ name, email, password });
        console.log("Registration response:", JSON.stringify(res));
        if (res?.success === true) {
          Toast.show({
            type: 'success',           
            text1: 'Đăng ký thành công',
            text2: 'Vui lòng đăng nhập để tiếp tục',
            position: 'bottom',       
            visibilityTime: 3000,      
          });
          navigation.navigate('Login');
        } else {
          Alert.alert("Đăng ký thất bại", res?.message || "Không xác định");
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

            <Text style={styles.title}>Đăng ký</Text>

            <View style={styles.inputContainer}>
              <Icon name="account-outline" size={22} color="#4facfe" style={styles.inputIcon} />
              <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={22} color="#4facfe" style={styles.inputIcon} />
              <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                  secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#4facfe" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-check-outline" size={22} color="#4facfe" style={styles.inputIcon} />
              <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#999"
                  secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity 
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#4facfe" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} activeOpacity={0.85} onPress={handleRegister}>
              <LinearGradient
                  colors={["#4facfe", "#00f2fe"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginGradient}
              >
                  <Icon name="account-plus" size={22} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.loginText}>Tạo tài khoản</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Đã có tài khoản? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signupLink}>Đăng nhập</Text>
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
    padding: 25,
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
    marginBottom: 20,
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
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
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
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default RegisterScreen;