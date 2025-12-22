#include "WiFiService.h"

WiFiService::WiFiService() : server(80) {}

void WiFiService::connect() {
    preferences.begin("wifi-config", true);
    String ssid = preferences.getString("ssid", "");
    String pass = preferences.getString("pass", "");
    preferences.end();

    if (ssid == "") {
        Serial.println("Chưa có cấu hình WiFi. Chuyển sang chế độ Pair...");
        startConfigPortal();
        return;
    }

    Serial.printf("Đang kết nối WiFi: %s\n", ssid.c_str());
    WiFi.begin(ssid.c_str(), pass.c_str());

    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry < 20) {
        delay(500);
        Serial.print(".");
        retry++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi Connected!");
    } else {
        Serial.println("\nKết nối thất bại. Chuyển sang chế độ Pair...");
        startConfigPortal();
    }
}

void WiFiService::startConfigPortal() {
    configMode = true;
    uint64_t chipid = ESP.getEfuseMac();
    String apName = "ESP32_Setup_" + String((uint32_t)chipid, HEX);
    
    WiFi.softAP(apName.c_str(), "12345678"); // Pass mặc định của WiFi phát ra
    Serial.println("Đã phát WiFi: " + apName);
    Serial.print("Truy cập địa chỉ: ");
    Serial.println(WiFi.softAPIP());

    server.on("/", std::bind(&WiFiService::handleRoot, this));
    server.on("/save", std::bind(&WiFiService::handleSave, this));
    server.begin();
}

void WiFiService::handleRoot() {
    String html = "<html><body><h1>WiFi Setup</h1>";
    html += "<form action='/save' method='POST'>";
    html += "SSID: <input type='text' name='ssid'><br>";
    html += "Password: <input type='password' name='pass'><br>";
    html += "<input type='submit' value='Save'>";
    html += "</form></body></html>";
    server.send(200, "text/html", html);
}

void WiFiService::handleSave() {
    String s = server.arg("ssid");
    String p = server.arg("pass");

    if (s != "") {
        preferences.begin("wifi-config", false);
        preferences.putString("ssid", s);
        preferences.putString("pass", p);
        preferences.end();
        
        server.send(200, "text/html", "Da luu. ESP32 dang khoi dong lai...");
        delay(2000);
        ESP.restart();
    }
}

void WiFiService::loopConfig() {
    if (configMode) {
        server.handleClient();
    }
}

bool WiFiService::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}