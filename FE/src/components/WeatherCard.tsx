import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type WeatherCardProps = {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  iconName?: string; // ví dụ "weather-sunny", "weather-rainy"
};

const WeatherCard = ({
  city,
  temperature,
  humidity,
  description,
  iconName = "weather-sunny",
}: WeatherCardProps) => {
  return (
    <LinearGradient
      colors={["#6dd5ed", "#2193b0"]} // gradient mát mắt hơn
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Icon thời tiết */}
        <Icon name={iconName} size={84} color="#fff" style={styles.icon} />

        {/* Nhiệt độ */}
        <Text style={styles.temp}>{temperature}°C</Text>

        {/* Mô tả */}
        <Text style={styles.desc}>{description}</Text>

        {/* Thông tin phụ */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Icon name="map-marker" size={18} color="#fff" />
            <Text style={styles.info}>{city}</Text>
          </View>
          <View style={styles.footerItem}>
            <Icon name="water" size={18} color="#fff" />
            <Text style={styles.info}>Độ ẩm: {humidity}%</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  content: {
    alignItems: "center",
  },
  icon: {
    marginBottom: 8,
  },
  temp: {
    fontSize: 60,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 6,
  },
  desc: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fdfdfd",
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.95,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  info: {
    maxWidth: 150,
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
});

export default WeatherCard;
