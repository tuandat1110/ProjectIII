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

void DisplayService::showSystemInfo(int x, int y, const char* message) {
    _display.clearDisplay();
    _display.setCursor(x, y);
    _display.println(message);
    _display.display();
}

