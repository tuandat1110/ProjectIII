#ifndef MQTT_SERVICE_H
#define MQTT_SERVICE_H

#include <WiFi.h>
#include <PubSubClient.h>

class MqttService {
private: 
    WiFiClient espClient;
    PubSubClient client;
    SemaphoreHandle_t mqttMutex;

    const char* _server;
    int port;
public:
    //constructor
    MqttService();

    void init(const char* server, int port, MQTT_CALLBACK_SIGNATURE);

    bool connect(const char* user, const char* pass,const char* subTopic);
    void loop();
    bool isConnected();

    bool publish(const char* topic,const char* payload, bool retained = true);
    bool subcribe(const char* topic);
    
    SemaphoreHandle_t getMutex();
};
#endif
