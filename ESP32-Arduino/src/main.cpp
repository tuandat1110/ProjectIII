#include <Arduino.h>
#include "config/config.h"
#include "models/LedCommand.h"
#include "services/WiFiService.h"
#include "services/MqttService.h"
#include "services/DisplayService.h"
#include "sensors/DhtSensor.h"

// Khởi tạo đối tượng
WiFiService wifi;
MqttService mqtt;
DhtSensor dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
DisplayService ui(display);

QueueHandle_t ledQueue;
String subscribeCommandTopic;
unsigned long lastReconnectAttempt = 0;
String sensorPublishTopic;
String flamePublishTopic;

void callback(char *topic, byte *message, unsigned int length) {
    char topicCopy[128];
    strncpy(topicCopy, topic, sizeof(topicCopy) - 1);
    topicCopy[sizeof(topicCopy) - 1] = '\0';

    char *parts[6]; 
    int count = 0;
    char *token = strtok(topicCopy, "/");
    while (token != NULL && count < 6) {
        parts[count++] = token;
        token = strtok(NULL, "/");
    }
    for(int i = 0; i < length && i < 64; i++) {
        Serial.print((char)message[i]);
    }
    for(int i=0; i < 6; i++) {
        Serial.printf("Part %d: %s\n", i, parts[i]);
    }
    if (count >= 5) {
        String recHId = String(parts[2]);
        String recRId = String(parts[3]);

        if (recHId == wifi.getHomeId() && recRId == wifi.getRoomId()) {
            LedCommand cmd;
            strncpy(cmd.topic, topic, sizeof(cmd.topic) - 1);
            cmd.topic[sizeof(cmd.topic) - 1] = '\0';

            unsigned int payload_len = (length < sizeof(cmd.payload)) ? length : (sizeof(cmd.payload) - 1);
            memcpy(cmd.payload, message, payload_len);
            cmd.payload[payload_len] = '\0';

            if (xQueueSend(ledQueue, &cmd, 0) != pdTRUE) {
                Serial.println("Queue đầy!");
            } else {
                Serial.printf("Đã nhận lệnh [%s]: %s\n", cmd.topic, cmd.payload);
            }
        } else {
            Serial.println("ID không khớp.");
        }
    }
}

// Task Led Control - Giữ nguyên logic strstr "/cmd" và "/state"
void TaskLedControl(void *pvParameters) {
    LedCommand cmd;
    char stateTopicBuffer[128]; 
    for (;;) {
        if (xQueueReceive(ledQueue, &cmd, portMAX_DELAY) == pdTRUE) {
            int pin; char status[8];
            if (sscanf(cmd.payload, "%d:%7s", &pin, status) == 2) {
                int command = (strcasecmp(status, "ON") == 0) ? LOW : HIGH;
                digitalWrite(pin, command);

                char *cmd_pos = strstr(cmd.topic, "/cmd");
                if (cmd_pos) {
                    int len_prefix = cmd_pos - cmd.topic;
                    snprintf(stateTopicBuffer, sizeof(stateTopicBuffer), "%.*s/state", len_prefix, cmd.topic);
                } else {
                    snprintf(stateTopicBuffer, sizeof(stateTopicBuffer), "%s/state", cmd.topic);
                }

                char feedback[16];
                snprintf(feedback, sizeof(feedback), "%d:%s", pin, (command == HIGH ? "OFF" : "ON"));
                mqtt.publish(stateTopicBuffer, feedback, true);
                Serial.printf("Đã gửi phản hồi tới [%s]: %s\n", stateTopicBuffer, feedback);
            }
        }
    }
}

// Task DHT11 - Giữ nguyên logic Serial.printf và payload JSON
void TaskReadDHT11(void *pvParameters) {
    for (;;) {
        DhtData data = dht.read();
        if (!data.isValid) {
            Serial.println("Lỗi đọc cảm biến DHT11!");
        } else {
            Serial.printf(" Nhiệt độ: %.1f°C,  Độ ẩm: %.1f%%\n", data.temperature, data.humidity);
            String payload = "{\"temperature\":" + String(data.temperature, 1) + ",\"humidity\":" + String(data.humidity, 1) + "}";
            if (mqtt.isConnected()) {
                //mqtt.publish("home/house1/livingroom/dht11/data", payload.c_str());
                //Serial.println("Đã gửi MQTT: " + payload);
                mqtt.publish(sensorPublishTopic.c_str(), payload.c_str());
                Serial.println("Đã gửi MQTT tới [" + sensorPublishTopic + "]: " + payload);
            } else {
                Serial.println("TaskReadDHT11: MQTT Disconnected, cannot publish.");
            }
        }
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}

// Task MQTT System - Giữ nguyên logic delay 3000ms reconnect
void TaskMQTT(void *pvParameters) {
    for (;;) {
        if (!mqtt.isConnected()) {
            unsigned long now = millis();
            if (now - lastReconnectAttempt > 3000) {
                lastReconnectAttempt = now;
                Serial.println("Trying MQTT reconnect...");
                mqtt.connect(mqtt_user, mqtt_password, subscribeCommandTopic.c_str());
            }
        } else {
            mqtt.loop();
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void TaskFlameSensor(void *pvParameters) {
    int lastFlameState = HIGH; // HIGH = không cháy (phổ biến với flame sensor)
    unsigned long lastPublishTime = 0;
    const unsigned long debounceTime = 3000; // chống spam (3s)

    for (;;) {
        int flameState = digitalRead(FLAME_PIN);
        unsigned long now = millis();

        // Chỉ xử lý khi trạng thái thay đổi
        if (flameState != lastFlameState && (now - lastPublishTime > debounceTime)) {

            if (mqtt.isConnected()) {
                String payload;

                if (flameState == LOW) {
                    // PHÁT HIỆN CHÁY
                    payload = "{\"type\":\"FIRE\",\"status\":1}";
                    Serial.println("🔥 FIRE DETECTED!");
                } else {
                    // HẾT CHÁY
                    payload = "{\"type\":\"FIRE\",\"status\":0}";
                    Serial.println("✅ FIRE CLEARED");
                }

                mqtt.publish(flamePublishTopic.c_str(), payload.c_str(), true);
                Serial.println("Đã gửi MQTT [" + flamePublishTopic + "]: " + payload);
            }

            lastPublishTime = now;
            lastFlameState = flameState;
        }

        vTaskDelay(pdMS_TO_TICKS(200)); // đọc sensor nhanh, nhưng không spam
    }
}



void setup() {
    Serial.begin(115200);

    pinMode(LED_PIN, OUTPUT);
    pinMode(4, OUTPUT);
    pinMode(FLAME_PIN, INPUT);
    digitalWrite(4, HIGH);
    digitalWrite(LED_PIN, HIGH);
    pinMode(RESET_BUTTON_PIN, INPUT_PULLUP);
    ledQueue = xQueueCreate(30, sizeof(LedCommand));

    ui.init(); 
    ui.showSystemInfo("WIFI CONNECTING...");

    wifi.connect(); 

    if (wifi.isConnected()) {
        uint64_t chipid = ESP.getEfuseMac();
        char chipStr[32];
        snprintf(chipStr, sizeof(chipStr), "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
        String hId = wifi.getHomeId(); 
        String rId = wifi.getRoomId();
        String CONTROLLER_ID = String((uint32_t)(chipid >> 32), HEX) + String((uint32_t)chipid, HEX);
        subscribeCommandTopic = "home/" + CONTROLLER_ID + "/+/+/+/cmd";
        sensorPublishTopic = "home/" + hId + "/" + rId + "/dht11/data";
        flamePublishTopic = "home/" + hId + "/" + rId + "/flame/alert";
        ui.showSystemInfo(chipStr);
        
        mqtt.init(mqtt_server, mqtt_port, callback);
        dht.begin();

        xTaskCreatePinnedToCore(TaskReadDHT11, "TaskReadDHT11", 4096, NULL, 1, NULL, 0);
        xTaskCreatePinnedToCore(TaskLedControl, "TaskLedControl", 4096, NULL, 3, NULL, 0);
        xTaskCreatePinnedToCore(TaskMQTT, "TaskMQTT", 4096, NULL, 3, NULL, 1);
        xTaskCreatePinnedToCore(TaskFlameSensor, "TaskFlame", 4096, NULL, 2, NULL, 0);
    }
}

void loop() {
    if (digitalRead(RESET_BUTTON_PIN) == LOW) { 
        unsigned long startTime = millis();
        while (digitalRead(RESET_BUTTON_PIN) == LOW) {
            if (millis() - startTime > RESET_HOLD_TIME) {
                Serial.println("Đang xóa cấu hình và khởi động lại...");
                ui.showSystemInfo("RESETING...");
                wifi.resetSettings(); 
                delay(1000);
                ESP.restart(); 
            }
            delay(10);
        }
    }
    wifi.loopConfig();
    delay(10);
}