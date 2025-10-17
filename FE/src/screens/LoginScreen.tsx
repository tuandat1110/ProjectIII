import React from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import Entypo from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get("window");

const LoginScreen = () => {
    return (
        <LinearGradient
            colors={["#4078c0", "#70a1ff", "#f5f6fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Entypo name="paper-plane" color="#000" size={80} />
                </View>
                <Text style={styles.title}>Đăng nhập</Text>
                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={22} color="#4078c0" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={22} color="#4078c0" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#888"
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
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
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 18,
        padding: 28,
        alignItems: "center",
        shadowColor: "#4078c0",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
    },
    iconContainer: {
        backgroundColor: "#fffbe6",
        borderRadius: 50,
        padding: 8,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4078c0",
        marginBottom: 32,
        letterSpacing: 1,
    },
    inputContainer: {
        width: "100%",
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        flexDirection: "row",
        alignItems: "center",
    },
    inputIcon: {
        marginRight: 8,
    },
    button: {
        width: "100%",
        height: 48,
        backgroundColor: "#4078c0",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default LoginScreen;