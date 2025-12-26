// RoomCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Room } from "../types/room";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { MainTabParamList, RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { uuidToBase62 } from "../utils/utils";

interface IRoom {
    room: Room
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
                <Text style={styles.title} numberOfLines={1}>{room.name}</Text>
                
                <View style={styles.idContainer}>
                    <View style={styles.idBadge}>
                        <Text style={styles.idLabel}>ROOM ID</Text>
                    </View>
                    <Text style={styles.idValue}>
                        {uuidToBase62(room.id as string)}
                    </Text>
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
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: "100%",
        height: 110,
    },
    infoContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1a202c",
    },
    idContainer: {
        marginTop: 4,
    },
    idBadge: {
        backgroundColor: "#f7fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
        alignSelf: "flex-start",
        marginBottom: 6,
    },
    idLabel: {
        fontSize: 8,
        fontWeight: "800",
        color: "#718096",
        letterSpacing: 0.5,
    },
    idValue: {
        fontSize: 10,
        color: "#4a5568",
        fontFamily: "monospace",
        lineHeight: 14,
    }
});