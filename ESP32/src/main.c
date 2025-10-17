#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "dht.h"     
#include "esp_log.h"

#define LED_PIN 2
#define DHT_PIN 23
#define DHT_TYPE DHT_TYPE_DHT11

static const char *TAG = "MAIN";

//  Task đọc cảm biến DHT11
void dht_task(void *pvParameter)
{
    float temperature, humidity;
    while (1)
    {
        if (dht_read_float_data(DHT_TYPE, DHT_PIN, &humidity, &temperature) == ESP_OK)
        {
            ESP_LOGI(TAG, "Nhiệt độ: %.1f°C, Độ ẩm: %.1f%%", temperature, humidity);
        }
        else
        {
            ESP_LOGW(TAG, "Không đọc được dữ liệu từ DHT11");
        }

        vTaskDelay(pdMS_TO_TICKS(2000)); // Mỗi 2 giây đọc 1 lần
    }
}

//  Task nháy LED
void led_task(void *pvParameter)
{
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);

    while (1)
    {
        gpio_set_level(LED_PIN, 1);
        ESP_LOGI("LED", "LED = %d", gpio_get_level(LED_PIN));
        vTaskDelay(pdMS_TO_TICKS(5000));
        gpio_set_level(LED_PIN, 0);
        ESP_LOGI("LED", "LED = %d", gpio_get_level(LED_PIN));
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}

void app_main(void)
{
    ESP_LOGI(TAG, "Khởi động chương trình...");

    xTaskCreate(dht_task, "dht_task", 4096, NULL, 10, NULL);
    xTaskCreate(led_task, "led_task", 2048, NULL, 5, NULL);
}
