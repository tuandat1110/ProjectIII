#pragma once

#include "esp_err.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    DHT_TYPE_DHT11 = 11,
    DHT_TYPE_AM2301 = 21,
    DHT_TYPE_DHT22 = 22
} dht_sensor_type_t;

/**
 * @brief Đọc dữ liệu từ cảm biến DHT
 * 
 * @param sensor_type Loại cảm biến (DHT11, DHT22, ...)
 * @param pin GPIO được kết nối với chân DATA của cảm biến
 * @param humidity Biến lưu độ ẩm (float)
 * @param temperature Biến lưu nhiệt độ (float)
 * @return esp_err_t ESP_OK nếu đọc thành công, ESP_FAIL nếu lỗi
 */
esp_err_t dht_read_float_data(dht_sensor_type_t sensor_type, gpio_num_t pin, float *humidity, float *temperature);

#ifdef __cplusplus
}
#endif
