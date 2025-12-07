import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [data, setData] = useState({ temperature: [], humidity: [] });

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://192.168.0.104:3000/influx/history?room=livingroom&minutes=120'
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.log('Error fetching Influx data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Convert dữ liệu cho gifted-charts
  const tempData = data.temperature.map(d => ({
    value: d.value,
    label: new Date(d.time).toLocaleTimeString().slice(0, 5),
  }));

  const humData = data.humidity.map(d => ({
    value: d.value,
    label: new Date(d.time).toLocaleTimeString().slice(0, 5),
  }));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        Dashboard - Living Room
      </Text>

      {/* Nhiệt độ */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>🌡️ Nhiệt độ (°C)</Text>
      <LineChart
        data={tempData}
        curved
        width={screenWidth - 40}
        height={220}
        thickness={3}
        color="#FF5733"
        yAxisTextStyle={{ color: '#555' }}
        xAxisLabelTextStyle={{ color: '#555', fontSize: 10 }}
        hideDataPoints={false}
        dataPointsColor="#FF5733"
        areaColor="rgba(255, 87, 51, 0.2)"
        startFillColor="rgba(255, 87, 51, 0.15)"
        endFillColor="rgba(255, 87, 51, 0.01)"
        style={{ borderRadius: 12, marginBottom: 30 }}
      />

      {/* Độ ẩm */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>💧 Độ ẩm (%)</Text>
      <LineChart
        data={humData}
        curved
        width={screenWidth - 40}
        height={220}
        thickness={3}
        color="#007AFF"
        yAxisTextStyle={{ color: '#555' }}
        xAxisLabelTextStyle={{ color: '#555', fontSize: 10 }}
        hideDataPoints={false}
        dataPointsColor="#007AFF"
        areaColor="rgba(0, 122, 255, 0.2)"
        startFillColor="rgba(0, 122, 255, 0.15)"
        endFillColor="rgba(0, 122, 255, 0.01)"
        style={{ borderRadius: 12 }}
      />
    </ScrollView>
  );
}
