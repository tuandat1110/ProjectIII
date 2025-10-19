#include "DHT.h"
#include "WiFi.h"
#include "PubSubClient.h"

#define DHTPIN 23
#define DHTTYPE DHT11
#define LED_PIN 2

// WiFi
const char *ssid = "Galaxy A54 5G 14B7";
const char *password = "12345678";

// MQTT broker (chú ý: nếu broker chạy trên PC thì không dùng 127.0.0.1)
const char *mqtt_server = "10.211.37.220";  // IP máy chạy EMQX/Mosquitto
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

TaskHandle_t taskReadDHT11;
TaskHandle_t taskLedBlink;

DHT dht(DHTPIN, DHTTYPE);

// Kết nối WiFi
void setUpWiFi() {
  Serial.println("Kết nối WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Đã kết nối WiFi! IP: ");
  Serial.println(WiFi.localIP());
}

// Kết nối MQTT broker
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Đang kết nối MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("thành công!");
      // Subscribe nếu cần
      //client.subscribe("home/led/control");
    } else {
      Serial.print("Thất bại, mã lỗi: ");
      Serial.print(client.state());
      Serial.println(" — thử lại sau 5 giây");
      delay(5000);
    }
  }
}

// Task đọc DHT11 và gửi dữ liệu MQTT
void TaskReadDHT11(void *pvParameters) {
  for (;;) {
    if (!client.connected()) {
      reconnectMQTT();
    }
    client.loop();

    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
      Serial.println("Lỗi đọc cảm biến DHT11!");
    } else {
      Serial.printf("Nhiệt độ: %.1f°C, Độ ẩm: %.1f%%\n", t, h);

      // Gửi lên MQTT broker
      String payload = "{\"temperature\":" + String(t, 1) +
                       ",\"humidity\":" + String(h, 1) + "}";
      client.publish("home/dht11/data", payload.c_str());
      Serial.println("Đã gửi MQTT: " + payload);
    }

    vTaskDelay(pdMS_TO_TICKS(5000));  // Gửi mỗi 5 giây
  }
}

// Task nhấp nháy LED
void TaskLedBlink(void *pvParameters) {
  pinMode(LED_PIN, OUTPUT);
  for (;;) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    vTaskDelay(pdMS_TO_TICKS(1000));  // 1 giây
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setUpWiFi();
  client.setServer(mqtt_server, mqtt_port);

  // Tạo task đọc cảm biến và gửi MQTT
  xTaskCreatePinnedToCore(
      TaskReadDHT11,   // Hàm task
      "TaskReadDHT11", // Tên task
      4096,            // Stack size
      NULL,            // Tham số
      1,               // Mức ưu tiên
      &taskReadDHT11,  // Handle
      1);              // Chạy trên core 1

  // Tạo task nháy LED
  xTaskCreatePinnedToCore(
      TaskLedBlink,
      "TaskLedBlink",
      2048,
      NULL,
      1,
      &taskLedBlink,
      1);
}

void loop() {
  // Không cần gì ở đây vì dùng FreeRTOS task
}
