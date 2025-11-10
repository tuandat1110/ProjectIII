import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface IPersonal {
    name: string | undefined
}

const PersonalCard = ({ name }: IPersonal) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
        <View style={styles.userInfo}>
            <Image source={require("../assets/user.png")} style={styles.avatar} />
            <Text style={styles.userName}>{name}</Text>
        </View>
        <Icon name="chevron-forward" size={22} color="#4e89c7" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // cho Android
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default PersonalCard;
