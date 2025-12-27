#ifndef WIFI_SERVICE_H
#define WIFI_SERVICE_H

#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h> 

class WiFiService {
private:
    WebServer server;
    Preferences preferences;
    bool configMode = false;

    // Các hàm xử lý giao diện Web
    void handleRoot();
    void handleSave();

public:
    WiFiService();
    void connect();
    void startConfigPortal(); 
    void loopConfig(); 
    bool isConnected();
    String getHomeId();
    String getRoomId();
    void resetSettings();
};

#endif