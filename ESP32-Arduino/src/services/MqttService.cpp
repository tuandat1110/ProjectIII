#include "MqttService.h"

MqttService::MqttService() : client(espClient) {
    mqttMutex = xSemaphoreCreateMutex();
}

void MqttService::init(const char* server, int port, MQTT_CALLBACK_SIGNATURE) {
    _server = server;
    port = port;
    client.setServer(_server, port);
    client.setCallback(callback);
}

bool MqttService::connect(const char* user, const char* pass, const char* subTopic) {
    if (xSemaphoreTake(mqttMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        // Giữ nguyên logic tạo Client ID cũ
        if (client.connect("ESP32Client", user, pass)) {
            client.subscribe(subTopic, 1);
            Serial.println("MQTT reconnect OK!"); // Giữ nguyên Serial cũ
            xSemaphoreGive(mqttMutex);
            return true;
        }
        xSemaphoreGive(mqttMutex);
    }
    return false;
}

void MqttService::loop() {
    if (xSemaphoreTake(mqttMutex, pdMS_TO_TICKS(5)) == pdTRUE) {
        client.loop();
        xSemaphoreGive(mqttMutex);
    }
}

bool MqttService::publish(const char* topic, const char* payload, bool retained) {
    if (xSemaphoreTake(mqttMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        bool res = client.publish(topic, payload, retained);
        xSemaphoreGive(mqttMutex);
        return res;
    }
    return false;
}

bool MqttService::isConnected() { return client.connected(); }