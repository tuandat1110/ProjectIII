import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


type WeatherCardProps = {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  iconName?: string; // ví dụ: "weather-partly-cloudy"
};

const WeatherCard = ({
  city,
  temperature,
  humidity,
  description,
  iconName = "weather-partly-cloudy",
}: WeatherCardProps) => {
  return (
    <LinearGradient
      colors={["#6dd5ed", "#2193b0"]} // gradient xanh mát
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.row}>
        {/* Bên trái */}
        <View style={styles.left}>
          <Text style={styles.title}>Vị trí của tôi</Text>
          <Text style={styles.subtitle}>{city}</Text>

          <View style={styles.footer}>
            <Icon name={iconName} size={20} color="#fff" />
            <Text style={styles.desc}>{description}</Text>
          </View>
        </View>

        {/* Bên phải */}
        <View style={styles.right}>
          <Text style={styles.temp}>{temperature}°</Text>
          <View style={styles.humid}>
            <Icon name="water" size={22} color="#00BFFF" style={styles.icon} />
            <Text style={styles.text}>{humidity}%</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#e0f7fa",
    marginBottom: 12,
    width: "80%"
  },
  desc: {
    fontSize: 11,
    color: "#fff",
    marginLeft: 6,
    width: "75%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  range: {
    fontSize: 13,
    color: "#e0f7fa",
    marginTop: 4,
  },
  humid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WeatherCard;
