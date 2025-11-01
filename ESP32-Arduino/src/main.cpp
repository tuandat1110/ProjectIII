#include "DHT.h"
#include "WiFi.h"
#include "PubSubClient.h"

#define DHTPIN 23
#define DHTTYPE DHT11
#define LED_PIN 2
#define PIR_PIN 14
//#define BUZZER_PIN 15

// WiFi
const char *ssid = "Tang 2";
const char *password = "11102004";

// MQTT broker
const char *mqtt_server = "192.168.0.102";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Task handle
TaskHandle_t taskReadDHT11;
TaskHandle_t taskLedControl;
TaskHandle_t taskReadPIR;

DHT dht(DHTPIN, DHTTYPE);

// CẤU HÌNH TOPIC
const char *house_id = "house1";
const char *room_id = "livingroom";
const char *device_id = "light1";
const char *category = "control";

// Ví dụ: home/house1/livingroom/light1/control
String ledControlTopic = "home/" + String(house_id) + "/" + String(room_id) + "/" + String(device_id) + "/" + String(category);

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

// Hàm callback khi nhận tin MQTT
void callback(char *topic, byte *message, unsigned int length) {
  String payload;
  for (unsigned int i = 0; i < length; i++) {
    payload += (char)message[i];
  }

  Serial.print("Nhận topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.println(payload);
  payload.replace("\r", "");
  payload.replace("\n", "");  
  payload.trim();

  if (String(topic) == ledControlTopic) {
    if (payload.equalsIgnoreCase("ON")) {
      digitalWrite(LED_PIN, HIGH);
      Serial.println(" Đèn BẬT");
    } else if (payload.equalsIgnoreCase("OFF")) {
      digitalWrite(LED_PIN, LOW);
      Serial.println(" Đèn TẮT");
    }
  }
}

// Kết nối MQTT broker
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Đang kết nối MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("thành công!");
      client.subscribe(ledControlTopic.c_str());  // Đăng ký lắng nghe lệnh bật/tắt đèn
      Serial.print("Đã subscribe topic: ");
      Serial.println(ledControlTopic);
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
      Serial.printf(" Nhiệt độ: %.1f°C,  Độ ẩm: %.1f%%\n", t, h);

      String payload = "{\"temperature\":" + String(t, 1) +
                       ",\"humidity\":" + String(h, 1) + "}";
      client.publish("home/house1/livingroom/dht11/data", payload.c_str());
      Serial.println("Đã gửi MQTT: " + payload);
    }

    vTaskDelay(pdMS_TO_TICKS(5000));  // Gửi mỗi 5 giây
  }
}

// Task điều khiển LED qua MQTT
void TaskLedControl(void *pvParameters) {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  for (;;) {
    if (!client.connected()) {
      reconnectMQTT();
    }
    client.loop();
    vTaskDelay(pdMS_TO_TICKS(100));  // Chạy thường xuyên để xử lý MQTT
  }
}

// Task đọc PIR
void TaskReadPIR(void *pvParameters) {
  vTaskDelay(pdMS_TO_TICKS(30000)); // Cho cảm biến ổn định
  pinMode(PIR_PIN, INPUT);
  for (;;) {
    int motion = digitalRead(PIR_PIN);
    if (motion == HIGH) {
      Serial.println(" Phát hiện chuyển động!");
      client.publish("home/house1/livingroom/pir/status", "1");
    } else {
      Serial.println(" Không có chuyển động.");
      client.publish("home/house1/livingroom/pir/status", "0");
    }
    vTaskDelay(pdMS_TO_TICKS(2000));
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setUpWiFi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Tạo các task
  xTaskCreatePinnedToCore(TaskReadDHT11, "TaskReadDHT11", 4096, NULL, 1, &taskReadDHT11, 1);
  xTaskCreatePinnedToCore(TaskLedControl, "TaskLedControl", 2048, NULL, 1, &taskLedControl, 1);
  xTaskCreatePinnedToCore(TaskReadPIR, "TaskReadPIR", 2048, NULL, 1, &taskReadPIR, 1);
}

void loop() {
  // Không cần gì ở đây
}
