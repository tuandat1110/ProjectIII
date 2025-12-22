#ifndef DISPLAY_SERVICE_H
#define DISPLAY_SERVICE_H

#include <Adafruit_SSD1306.h>

class DisplayService {
private:
    Adafruit_SSD1306& _display; // Tham chiếu đến đối tượng display gốc

public:
    // Constructor
    DisplayService(Adafruit_SSD1306& display);
    void init();

    // Hiển thị thông tin (Dùng const char* thay cho String)
    void showSystemInfo(const char* homeId);
};

#endif