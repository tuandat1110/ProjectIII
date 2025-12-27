#ifndef LED_COMMAND_H
#define LED_COMMAND_H

/**
 * Struct này dùng để đóng gói dữ liệu nhận được từ MQTT 
 * để đẩy vào Queue xử lý điều khiển thiết bị.
 */
struct LedCommand {
    char topic[128];   // Lưu trữ topic mà tin nhắn được gửi đến
    char payload[32]; // Lưu trữ nội dung lệnh, ví dụ: "2:ON" hoặc "2:OFF"
};

#endif