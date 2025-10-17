#include "dht.h"
#include "esp_rom_sys.h"

static const char *TAG = "DHT";

#define DHT_MAX_TIMINGS 85

static esp_err_t dht_read_data(dht_sensor_type_t sensor_type, gpio_num_t pin, int16_t *humidity, int16_t *temperature)
{
    int data[5] = {0, 0, 0, 0, 0};
    int counter = 0;
    uint8_t laststate = 1;
    uint8_t bitidx = 0;

    gpio_set_direction(pin, GPIO_MODE_OUTPUT);
    gpio_set_level(pin, 0);
    vTaskDelay(pdMS_TO_TICKS(20)); // Gửi tín hiệu bắt đầu
    gpio_set_level(pin, 1);
    esp_rom_delay_us(40);
    gpio_set_direction(pin, GPIO_MODE_INPUT);

    // Đọc tín hiệu 85 lần
    for (int i = 0; i < DHT_MAX_TIMINGS; i++)
    {
        counter = 0;
        while (gpio_get_level(pin) == laststate)
        {
            counter++;
            esp_rom_delay_us(1);
            if (counter == 255)
                break;
        }
        laststate = gpio_get_level(pin);
        if (counter == 255)
            break;

        // Bỏ qua 3 xung đầu
        if ((i >= 4) && (i % 2 == 0))
        {
            data[bitidx / 8] <<= 1;
            if (counter > 50)
                data[bitidx / 8] |= 1;
            bitidx++;
        }
    }

    // Kiểm tra dữ liệu có hợp lệ không
    if ((bitidx >= 40) && ((data[0] + data[1] + data[2] + data[3]) & 0xFF) == data[4])
    {
        if (sensor_type == DHT_TYPE_DHT11)
        {
            *humidity = data[0];
            *temperature = data[2];
        }
        else
        {
            int16_t raw_humidity = (data[0] << 8) + data[1];
            int16_t raw_temperature = (data[2] << 8) + data[3];

            if (raw_temperature & 0x8000)
            {
                raw_temperature = -((raw_temperature & 0x7FFF));
            }
            *humidity = raw_humidity;
            *temperature = raw_temperature;
        }
        return ESP_OK;
    }

    ESP_LOGW(TAG, "Dữ liệu không hợp lệ hoặc checksum sai");
    return ESP_FAIL;
}

esp_err_t dht_read_float_data(dht_sensor_type_t sensor_type, gpio_num_t pin, float *humidity, float *temperature)
{
    int16_t h = 0, t = 0;
    esp_err_t result = dht_read_data(sensor_type, pin, &h, &t);
    if (result == ESP_OK)
    {
        if (sensor_type == DHT_TYPE_DHT11)
        {
            *humidity = h;
            *temperature = t;
        }
        else
        {
            *humidity = h / 10.0;
            *temperature = t / 10.0;
        }
    }
    return result;
}
