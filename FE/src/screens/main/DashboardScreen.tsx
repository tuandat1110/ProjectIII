import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import HeaderV2 from '../../components/Header-V2';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deviceApi } from '../../api/deviceApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { uuidToBase62 } from '../../utils/utils';

const screenWidth = Dimensions.get('window').width;
const PADDING_HORIZONTAL = 15;
const DURATION_OPTIONS = [
  { label: '30 phút (0.5 giờ)', durationSeconds: 30 * 60 },
  { label: '1 giờ', durationSeconds: 60 * 60 },
  { label: '3 giờ', durationSeconds: 3 * 60 * 60 },
  { label: '6 giờ', durationSeconds: 6 * 60 * 60 },
  { label: '12 giờ', durationSeconds: 12 * 60 * 60 },
  { label: '1 ngày', durationSeconds: 24 * 60 * 60 },
  { label: '3 ngày', durationSeconds: 3 * 24 * 60 * 60 },
  { label: '7 ngày', durationSeconds: 7 * 24 * 60 * 60 },
];

export default function DashboardScreen() {
  const [chartData, setChartData] = useState({ data: [] });
  const [selectedDurationSeconds, setSelectedDurationSeconds] = useState(
    String(DURATION_OPTIONS[1].durationSeconds) // Mặc định là 1 giờ (3600 giây)
  );
  const currentSelectedId = useSelector((state: RootState) => state.house.selectedHomeId);
  const navigation = useNavigation() as any;
  const aggregateSeconds = useMemo(() => {
    const duration = parseInt(selectedDurationSeconds, 10);
    let calculatedAggSeconds = Math.round(duration / 50);
    if (duration <= 3600) {
      return calculatedAggSeconds < 30 ? 30 : calculatedAggSeconds;
    } else if (duration <= 21600) { 
      return Math.round(calculatedAggSeconds / 60) * 60;
    } else { 
      const fiveMinutes = 300;
      return Math.round(calculatedAggSeconds / fiveMinutes) * fiveMinutes;
    }
  }, [selectedDurationSeconds]);

  const fetchData = async () => {
    try {
      const durationMinutes = Math.round(parseInt(selectedDurationSeconds, 10) / 60);

      //const url = `http://192.168.0.102:3000/influx/history?durationMinutes=${durationMinutes}&aggregateSeconds=${aggregateSeconds}&homeId=${uuidToBase62(currentSelectedId as string)}`;

      const res = await deviceApi.getHistoryData(durationMinutes,aggregateSeconds,uuidToBase62(currentSelectedId as string));
      //console.log(`Fetching: durationMinutes=${durationMinutes}, aggregateSeconds=${aggregateSeconds}. Data points received: ${JSON.stringify(res)}`);
      setChartData(res);
    } catch (e) {
      console.log('Error fetching Influx data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDurationSeconds, aggregateSeconds]); 

  const apiData = Array.isArray(chartData?.data) ? chartData.data : [];

  const temperature = apiData.map(item => ({
    time: item?.time ?? null,
    value: item?.temperature ?? 0,
  }));

  const humidity = apiData.map(item => ({
    time: item?.time ?? null,
    value: item?.humidity ?? 0,
  }));

  const tempLabels = temperature.map(d =>
    d.time ? new Date(d.time).toLocaleTimeString().slice(0, 5) : "--:--"
  );
  const tempValues = temperature.map(d => d.value);

  const humLabels = humidity.map(d =>
    d.time ? new Date(d.time).toLocaleTimeString().slice(0, 5) : "--:--"
  );
  const humValues = humidity.map(d => d.value);

  const createChartHTML = (labels, values, color, title) => {
    const maxY = title === "Temperature" ? 30 : 90;

    return `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { margin: 0; padding: 0; background: #ffffff; height: 100%; }
          #chart { width: 100% !important; height: 100% !important; }
        </style>
      </head>

      <body>
        <canvas id="chart"></canvas>
        <script>
          const ctx = document.getElementById('chart').getContext('2d');
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, '${color}55');
          gradient.addColorStop(1, '${color}00');

          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: '${title}',
                data: ${JSON.stringify(values)},
                borderColor: '${color}',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.45,
                pointRadius: 0,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { 
                  ticks: { color: '#222', font: { size: 18 }, maxRotation: 0, autoSkip: true }, 
                  grid: { display: false } 
                },
                y: { 
                  min: 0, max: ${maxY}, 
                  ticks: { color: '#222', font: { size: 18 }, maxTicksLimit: 5 },
                  grid: { color: '#eee' } 
                }
              }
            }
          });
        </script>
      </body>
    </html>`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderV2 navigation={navigation} title="Biểu đồ dữ liệu" />
      <View style={styles.selectContainer}>
        <Text style={styles.inputLabel}>Xem dữ liệu trong khoảng:</Text>
        <Picker
          style={styles.pickerBox}
          selectedValue={selectedDurationSeconds}
          onValueChange={(v) => setSelectedDurationSeconds(v)}
        >
          {DURATION_OPTIONS.map((option) => (
            <Picker.Item 
              key={option.durationSeconds} 
              label={option.label} 
              value={String(option.durationSeconds)} 
            />
          ))}
        </Picker>
        <Text style={styles.aggregateInfo}>
            Khoảng cách lấy mẫu (Aggregate): {aggregateSeconds} giây
        </Text>
      </View>
      <View style={styles.chartTitleContainer}>
        <Icon name="thermometer-half" size={20} color="#FF5733" style={{ marginRight: 8 }} />
        <Text style={styles.chartTitleText}>Nhiệt độ (°C)</Text>
      </View>
      <WebView
        style={styles.webViewStyle}
        originWhitelist={["*"]}
        source={{ html: createChartHTML(tempLabels, tempValues, "#FF5733", "Temperature") }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
      <View style={[styles.chartTitleContainer, { marginTop: 30 }]}>
        <Icon name="tint" size={20} color="#007AFF" style={{ marginRight: 8 }} />
        <Text style={styles.chartTitleText}>Độ ẩm (%)</Text>
      </View>
      <WebView
        style={styles.webViewStyle}
        originWhitelist={["*"]}
        source={{ html: createChartHTML(humLabels, humValues, "#007AFF", "Humidity") }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 10,
  },

  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600'
  },

  webViewStyle: {
    width: screenWidth - PADDING_HORIZONTAL * 2,
    height: 260,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    alignSelf: "center",
  },

  selectContainer: {
    marginBottom: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd"
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 5
  },

  pickerBox: {
    backgroundColor: "#fff",
    borderColor: "#ccc",


    color: "black",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  
  aggregateInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitleText: {
    fontSize: 18,
    fontWeight: '600'
  },
});
