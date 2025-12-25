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

// Hàm callback giữ nguyên logic copy an toàn
void callback(char *topic, byte *message, unsigned int length) {
    LedCommand cmd;
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
}

// Task Led Control - Giữ nguyên logic strstr "/cmd" và "/state"
void TaskLedControl(void *pvParameters) {
    LedCommand cmd;
    char stateTopicBuffer[64];
    for (;;) {
        if (xQueueReceive(ledQueue, &cmd, portMAX_DELAY) == pdTRUE) {
            int pin; char status[8];
            if (sscanf(cmd.payload, "%d:%7s", &pin, status) == 2) {
                int command = (strcasecmp(status, "ON") == 0) ? LOW : HIGH;
                digitalWrite(pin, command);

                char *cmd_pos = strstr(cmd.topic, "/cmd");
                if (cmd_pos) {
                    int len_prefix = cmd_pos - cmd.topic;
                    strncpy(stateTopicBuffer, cmd.topic, len_prefix);
                    stateTopicBuffer[len_prefix] = '\0';
                    strcat(stateTopicBuffer, "/state");
                } else {
                    strncpy(stateTopicBuffer, cmd.topic, sizeof(stateTopicBuffer) - 1);
                }

                char feedback[16];
                snprintf(feedback, sizeof(feedback), "%d:%s", pin, (command == HIGH ? "OFF" : "ON"));
                mqtt.publish(stateTopicBuffer, feedback, true);
            } else {
                Serial.println("Payload không hợp lệ!");
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
                mqtt.publish("home/house1/livingroom/dht11/data", payload.c_str());
                Serial.println("Đã gửi MQTT: " + payload);
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

void setup() {
    Serial.begin(115200);

    pinMode(LED_PIN, OUTPUT);
    pinMode(4, OUTPUT);
    digitalWrite(4, HIGH);
    digitalWrite(LED_PIN, HIGH);
    pinMode(RESET_BUTTON_PIN, INPUT_PULLUP);
    ledQueue = xQueueCreate(30, sizeof(LedCommand));

    ui.init(); 
    ui.showSystemInfo("WIFI CONNECTING...");

    wifi.connect(); 

    if (wifi.isConnected()) {
        String hId = wifi.getHomeId(); 
        String rId = wifi.getRoomId();
        uint64_t chipid = ESP.getEfuseMac();
        char chipStr[32];
        snprintf(chipStr, sizeof(chipStr), "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
        
        String CONTROLLER_ID = String((uint32_t)(chipid >> 32), HEX) + String((uint32_t)chipid, HEX);
        subscribeCommandTopic = "home/" + CONTROLLER_ID + "/+/+/cmd";
        sensorPublishTopic = "home/" + hId + "/" + rId + "/dht11/data";
        ui.showSystemInfo(chipStr);
        
        mqtt.init(mqtt_server, mqtt_port, callback);
        dht.begin();

        xTaskCreatePinnedToCore(TaskReadDHT11, "TaskReadDHT11", 4096, NULL, 1, NULL, 0);
        xTaskCreatePinnedToCore(TaskLedControl, "TaskLedControl", 4096, NULL, 3, NULL, 0);
        xTaskCreatePinnedToCore(TaskMQTT, "TaskMQTT", 4096, NULL, 3, NULL, 1);
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