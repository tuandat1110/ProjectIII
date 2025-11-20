#include "DHT.h"
#include "WiFi.h"
#include "PubSubClient.h"
#include "Wire.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

#define DHTPIN 23
#define DHTTYPE DHT11
#define LED_PIN 2
#define PIR_PIN 14
#define SDA_PIN 21
#define SCL_PIN 22
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
//#define BUZZER_PIN 15

struct LedCommand {
    char topic[64];   // topic gốc
    char payload[16]; // ví dụ "2:ON"
};

// Thêm Mutex cho MQTT
SemaphoreHandle_t mqttMutex;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// WiFi
const char *ssid = "Tang 2";
const char *password = "11102004";

// MQTT broker
const char *mqtt_server = "192.168.0.101";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Task handle
TaskHandle_t taskReadDHT11;
TaskHandle_t taskLedControl;
TaskHandle_t taskReadPIR;
TaskHandle_t taskMqtt;

DHT dht(DHTPIN, DHTTYPE);

//queue
QueueHandle_t ledQueue;

// CẤU HÌNH TOPIC
const char *house_id = "house1";
const char *room_id = "livingroom";
const char *device_id = "light1";
const char *category = "control";
uint64_t chipid = ESP.getEfuseMac();

// Ví dụ: home/house1/livingroom/light1/control
String CONTROLLER_ID = String((uint32_t)(chipid >> 32), HEX) + String((uint32_t)chipid, HEX); // Dùng 64 bit Chip ID
String subscribeCommandTopic = "home/" + CONTROLLER_ID + "/+/+/cmd";

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

unsigned long lastReconnectAttempt = 0;

bool mqttReconnect() {
  if (client.connect("ESP32Client")) {
    client.subscribe(subscribeCommandTopic.c_str(), 1);
    Serial.println("MQTT reconnect OK!");
    return true;
  }
  return false;
}

// Task điều khiển LED qua MQTT (SỬA LỖI STRING)
void TaskLedControl(void *pvParameters) {
    LedCommand cmd;
    char stateTopicBuffer[64]; // Buffer chứa topic phản hồi

    for (;;) {
        if (xQueueReceive(ledQueue, &cmd, portMAX_DELAY) == pdTRUE) {
            int pin;
            char status[8];

            if (sscanf(cmd.payload, "%d:%7s", &pin, status) == 2) {
                int command = (strcasecmp(status,"ON")==0) ? HIGH : LOW;
                digitalWrite(pin, command);
                // Serial.printf("Pin %d -> %s\n", pin, (command==HIGH?"BẬT":"TẮT"));
                if (xSemaphoreTake(mqttMutex, pdMS_TO_TICKS(100)) == pdTRUE) { 
                    char *cmd_pos = strstr(cmd.topic, "/cmd");
                    if (cmd_pos) {
                        // Copy phần đầu của topic
                        int len_prefix = cmd_pos - cmd.topic;
                        strncpy(stateTopicBuffer, cmd.topic, len_prefix);
                        stateTopicBuffer[len_prefix] = '\0';
                        // Thêm "/state" vào
                        strcat(stateTopicBuffer, "/state");
                    } else {
                        // Trường hợp không tìm thấy /cmd (fallback)
                        strncpy(stateTopicBuffer, cmd.topic, sizeof(stateTopicBuffer) - 1);
                    }
                    char feedback[16];
                    snprintf(feedback,sizeof(feedback),"%d:%s", pin, (command==HIGH?"ON":"OFF"));
                    
                    // client.publish với QoS 1
                    client.publish(stateTopicBuffer, feedback, 1);
                    xSemaphoreGive(mqttMutex); // KẾT THÚC: Giải phóng Mutex
                } else {
                    Serial.println("TaskLedControl: Lỗi Mutex khi gửi feedback!");
                }
            } else {
                Serial.println("Payload không hợp lệ!");
            }
        }
    }
}

// Hàm callback khi nhận tin MQTT
void callback(char *topic, byte *message, unsigned int length) {
  LedCommand cmd;
  // char payloadBuffer[length + 1]; 
  // Copy topic và payload an toàn vào struct
  strncpy(cmd.topic, topic, sizeof(cmd.topic) - 1);
  cmd.topic[sizeof(cmd.topic) - 1] = '\0';
  unsigned int payload_len = (length < sizeof(cmd.payload)) ? length : (sizeof(cmd.payload) - 1);
  memcpy(cmd.payload, message, payload_len);
  cmd.payload[payload_len] = '\0';

  if (xQueueSend(ledQueue, &cmd, 0) != pdTRUE) {
      Serial.println("Queue đầy, không gửi được lệnh!");
  } else {
      Serial.printf("Đã nhận lệnh [%s]: %s\n", cmd.topic, cmd.payload);
  }
    // Không cần tạo String payloadStr để in ra Serial, chỉ cần in message trực tiếp
    // Vấn đề: Để in ra Serial dễ đọc, chúng ta phải chuyển message sang chuỗi, 
    // nhưng việc này an toàn hơn là tạo nhiều đối tượng String.
    
    // Tạo buffer để chứa chuỗi kết thúc null (null-terminated string) từ message
    /*char payloadBuffer[length + 1]; 
    memcpy(payloadBuffer, message, length);
    payloadBuffer[length] = '\0'; // Kết thúc chuỗi bằng null

    Serial.print("Nhận topic: "); Serial.println(topic);
    Serial.print("Payload: "); Serial.println(payloadBuffer);

    // -------------------------
    // 1. Phân tích payload JSON (Sử dụng payloadBuffer)
    // Kích thước 256 bytes cho StaticJsonDocument là hợp lý
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, payloadBuffer); 
    
    if (error) {
        Serial.print(F("Lỗi deserializeJson: "));
        Serial.println(error.f_str());
        return;
    }

    // **SỬA LỖI LOGIC:** Đọc giá trị "status" dưới dạng chuỗi và lấy PIN
    const char* statusStr = doc["status"] | "OFF"; // Lấy giá trị chuỗi, mặc định là "OFF"
    
    int pin = -1; // Khởi tạo với giá trị không hợp lệ mặc định

    // 1. Kiểm tra nếu "pin" tồn tại và là số nguyên
    if (doc.containsKey("pin") && doc["pin"].is<int>()) {
        pin = doc["pin"].as<int>();
    } 
    // 2. Nếu không phải số nguyên, kiểm tra xem nó có phải là chuỗi không
    else if (doc.containsKey("pin") && doc["pin"].is<const char*>()) {
        // Lấy chuỗi và thử chuyển đổi sang số nguyên
        const char* pin_str = doc["pin"].as<const char*>();
        // Hàm strtol/strtoul hoặc atoi/sscanf có thể được dùng
        // Trong môi trường Arduino/Espressif, hàm toInt() của String là tiện lợi, 
        // hoặc đơn giản là dùng `atoi` với `const char*`
        
        // Sử dụng atoi/atol (an toàn hơn là strtol để kiểm tra lỗi)
        long temp_pin = atol(pin_str);
        
        // Kiểm tra xem chuỗi có thực sự là một số hợp lệ không
        // Cần đảm bảo rằng chuỗi không rỗng và atol không trả về 0 nếu số thực sự là 0
        // Với ArduinoJson và các giá trị số đơn giản, atol thường là đủ.
        
        // Giả định chuỗi hợp lệ nếu atol trả về một số (trừ khi chuỗi là "0" hoặc "" và cần xử lý đặc biệt)
        // Để đơn giản và đáp ứng yêu cầu "chuỗi kiểu số", ta chấp nhận atol.
        pin = (int)temp_pin;
        
        // Cần một cách kiểm tra string to number kỹ hơn để đảm bảo nó chỉ chứa số
        // Nếu chỉ dùng `atol`, nó sẽ chuyển đổi "2a" thành 2, điều này có thể không mong muốn.
        // Nếu muốn kiểm tra nghiêm ngặt hơn, bạn nên dùng hàm tự kiểm tra hoặc `strtol`.
        
        // Sử dụng phương pháp kiểm tra nghiêm ngặt hơn (dùng strtol)
        char *endptr;
        temp_pin = strtol(pin_str, &endptr, 10);
        
        // Kiểm tra nếu endptr chỉ vào ký tự null ('\0'), 
        // nghĩa là toàn bộ chuỗi đã được chuyển đổi thành số.
        if (*endptr == '\0' && endptr != pin_str) {
            pin = (int)temp_pin;
        } else {
            // Chuỗi không phải là số hợp lệ (ví dụ: "abc", "2a", "")
            pin = -1;
        }
    } 
    // 3. Nếu không phải số nguyên và không phải chuỗi, pin vẫn là -1

    Serial.printf("Pin: %d\n", pin); // Thêm \n để xuống dòng cho Serial.printf

    if (pin < 0) {
        Serial.println("Payload không có pin hợp lệ");
        return;
    }

    // Tiếp tục xử lý với `pin`

    // -------------------------
    // 2. Thực thi lệnh bật/tắt
    // **SỬA LỖI:** So sánh chuỗi an toàn bằng strcasecmp/strcmp
    // strcasecmp so sánh không phân biệt hoa/thường (tốt hơn)
    int command = (strcasecmp(statusStr, "ON") == 0) ? HIGH : LOW; 

    // Gán trạng thái cho Pin
    digitalWrite(pin, command);
    Serial.printf("Device on Pin: %d → %s\n", pin, (command == HIGH ? "BẬT" : "TẮT"));

    // -------------------------
    // 3. Tách device_id từ topic (Dùng char* và strtok_r để tránh String class)
    // Topic mẫu: home/{mac}/{room}/{device_id}/cmd
    
    char topicBuffer[128]; 
    strncpy(topicBuffer, topic, 128); // Copy topic an toàn
    topicBuffer[127] = '\0';

    char *token;
    char *rest = topicBuffer;
    int index = 0;
    const char *deviceIdCstr = NULL;

    // Tách các phần tử của topic bằng dấu '/'
    while ((token = strtok_r(rest, "/", &rest))) {
        if (index == 3) { // device_id là phần tử thứ 4 (index 3)
            deviceIdCstr = token;
            break; 
        }
        index++;
    }
    
    if (deviceIdCstr == NULL) {
        Serial.println("Không xác định device_id từ topic");
        return;
    }

    // -------------------------
    // 4. Publish state feedback (Tạo topic bằng char array/sprintf)
    
    // Tạo topic phản hồi: status/{mac}/{room}/{device_id}/state
    // Vì bạn đang dùng String cho subscribe, tạm thời dùng String để replace Topic:
    String stateTopic = String(topic);
    stateTopic.replace("/cmd", "/state"); // home/{mac}/{room}/{device_id}/state

    StaticJsonDocument<128> feedback;
    feedback["status"] = (command == HIGH); // Trạng thái là boolean
    feedback["pin"] = pin;
    feedback["device"] = deviceIdCstr; // Gửi device_id đã tách
    
    char buf[128];
    size_t n = serializeJson(feedback, buf);

    client.publish(stateTopic.c_str(), buf, n);
    Serial.printf("Published feedback: %s → %s\n", stateTopic.c_str(), buf);*/
}

// Kết nối MQTT broker
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Đang kết nối MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("thành công!");
      client.subscribe(subscribeCommandTopic.c_str());  // Đăng ký lắng nghe lệnh bật/tắt đèn
      Serial.print("Đã subscribe topic: ");
      Serial.println(subscribeCommandTopic);
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
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
      Serial.println("Lỗi đọc cảm biến DHT11!");
    } else {
      Serial.printf(" Nhiệt độ: %.1f°C,  Độ ẩm: %.1f%%\n", t, h);
      String payload = "{\"temperature\":" + String(t, 1) +
                       ",\"humidity\":" + String(h, 1) + "}";
      if (xSemaphoreTake(mqttMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        if (client.connected()) {
          client.publish("home/house1/livingroom/dht11/data", payload.c_str());
          Serial.println("Đã gửi MQTT: " + payload);
        }
        else{
          Serial.println("TaskReadDHT11: MQTT Disconnected, cannot publish.");
        }
        xSemaphoreGive(mqttMutex);
      }else {
        Serial.println("TaskReadDHT11: Lỗi Mutex timeout khi gửi DHT.");
      }
    }

    vTaskDelay(pdMS_TO_TICKS(5000));  // Gửi mỗi 5 giây
  }
}

// Task đọc PIR
// void TaskReadPIR(void *pvParameters) {
//   vTaskDelay(pdMS_TO_TICKS(30000)); // Cho cảm biến ổn định
//   pinMode(PIR_PIN, INPUT);
//   for (;;) {
//     int motion = digitalRead(PIR_PIN);
//     if (motion == HIGH) {
//       Serial.println(" Phát hiện chuyển động!");
//       client.publish("home/house1/livingroom/pir/status", "1");
//     } else {
//       Serial.println(" Không có chuyển động.");
//       client.publish("home/house1/livingroom/pir/status", "0");
//     }
//     vTaskDelay(pdMS_TO_TICKS(2000));
//   }
// }

// Task MQTT (Bắt buộc dùng Mutex)
void TaskMQTT(void *pvParameters) {
  lastReconnectAttempt = 0;

  for (;;) {
    // Luôn cố gắng lấy Mutex trước khi tương tác với client.loop()
    if (xSemaphoreTake(mqttMutex, pdMS_TO_TICKS(5)) == pdTRUE) { 
        if (!client.connected()) {
            unsigned long now = millis();
            if (now - lastReconnectAttempt > 3000) {
                lastReconnectAttempt = now;
                Serial.println("Trying MQTT reconnect...");
                // Note: mqttReconnect() cũng cần Mutex nếu nó gọi client.subscribe
                mqttReconnect(); 
            }
        } else {
            client.loop();
        }
        xSemaphoreGive(mqttMutex); 
    }
    vTaskDelay(0); 
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  ledQueue = xQueueCreate(30, sizeof(LedCommand)); // queue 10 item, mỗi item 256 byte
  if (!ledQueue) Serial.println("Không tạo được ledQueue!");
  // KHỞI TẠO MUTEX
  mqttMutex = xSemaphoreCreateMutex(); 
  if (!mqttMutex) Serial.println("Không tạo được Mutex MQTT!");

  char chipStr[32];
  snprintf(chipStr, sizeof(chipStr), "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
  Wire.begin(SDA_PIN,SCL_PIN);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 20);
  display.println("Home ID:");
  display.setCursor(10,32);
  display.println(chipStr);
  display.display();
  dht.begin();
  setUpWiFi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Tạo các task
  xTaskCreatePinnedToCore(TaskReadDHT11, "TaskReadDHT11", 4096, NULL, 1, &taskReadDHT11, 0);
  xTaskCreatePinnedToCore(TaskLedControl, "TaskLedControl", 4096, NULL, 3, &taskLedControl, 0);
  //xTaskCreatePinnedToCore(TaskReadPIR, "TaskReadPIR", 2048, NULL, 1, &taskReadPIR, 0);
  xTaskCreatePinnedToCore(TaskMQTT, "TaskMQTT", 4096, NULL, 3, &taskMqtt, 1);
}

void loop() {}
