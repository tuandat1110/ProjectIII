import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { uuidToBase62 } from "../utils/utils";

type WeatherCardProps = {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  iconName?: string;
  currentSelectedId?: string;
};

const WeatherCard = ({
  city,
  temperature,
  humidity,
  description,
  iconName = "weather-partly-cloudy",
  currentSelectedId,
}: WeatherCardProps) => {
  console.log(`Current selected ID in WeatherCard: ${currentSelectedId}`);
  return (
    <LinearGradient
      colors={["#6dd5ed", "#2193b0"]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.title}>Vị trí của tôi</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{city}</Text>
          
          <View style={styles.idSection}>
            <View style={styles.idBadge}>
              <Text style={styles.idLabel}>HOME ID</Text>
            </View>
            <Text style={styles.idValue}>
              {
                typeof currentSelectedId === "string" &&
                currentSelectedId.trim().length > 0
                  ? uuidToBase62(currentSelectedId.trim())
                  : "N/A"
              }
            </Text>
          </View>

          <View style={styles.footer}>
            <Icon name={iconName} size={20} color="#fff" />
            <Text style={styles.desc}>{description}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.temp}>{temperature}°</Text>
          <View style={styles.humidRow}>
            <Icon name="water" size={18} color="#e0f7fa" />
            <Text style={styles.humidText}>{humidity}%</Text>
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
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#e0f7fa",
    marginBottom: 10,
  },
  idSection: {
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  idLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 10,
    color: "rgba(224, 247, 250, 0.9)",
    fontFamily: "monospace",
    lineHeight: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  desc: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 54,
  },
  humidRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
  },
  humidText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 2,
  },
});

export default WeatherCard;