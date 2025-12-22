#include "DisplayService.h"

DisplayService::DisplayService(Adafruit_SSD1306& display): _display(display) {}

void DisplayService::init() {
    if (!_display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("SSD1306 allocation failed"));
        return;
    }
    _display.clearDisplay();
    _display.clearDisplay();
    _display.setTextSize(1);
    _display.setTextColor(SSD1306_WHITE);
    _display.display();
}

void DisplayService::showSystemInfo(const char* homeId) {
    _display.clearDisplay();
    _display.setCursor(10, 20);
    _display.println("Home ID:");
    _display.setCursor(10, 32);
    _display.println(homeId); // In chuỗi char*
    _display.display();
}

