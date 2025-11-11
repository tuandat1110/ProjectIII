import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { MainTabParamList, RootStackParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface IPersonal {
    name: string | undefined
}

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Personal'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const PersonalCard = ({ name }: IPersonal) => {
    const navigtation = useNavigation<NavigationProp>();
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => navigtation.navigate('ProfileDetail')}>
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
