// RoomCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Room } from "../types/room";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { MainTabParamList, RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

interface IRoom {
    room: Room
    //onToggle: (id: string) => {}
}

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function RoomCard({ room }: IRoom) {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Room', room)}>
      <Image source={{ uri: room.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>{room.devices} Devices</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.statusText}>{room.isOn ? "ON" : "OFF"}</Text>
          {/* <Switch value={room.isOn} onValueChange={() => onToggle(room.id as string)} /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontWeight: "600",
  },
});
