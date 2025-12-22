#include "DhtSensor.h"

// Khởi tạo đối tượng DHT sử dụng danh sách khởi tạo (initialization list)
DhtSensor::DhtSensor(uint8_t pin, uint8_t type) : dht(pin, type), _pin(pin), _type(type) {}

void DhtSensor::begin() {
    dht.begin();
}

DhtData DhtSensor:: read() {
    DhtData data;

    data.humidity = dht.readHumidity();
    data.temperature = dht.readTemperature();
    if (isnan(data.humidity) || isnan(data.temperature)) {
        data.isValid = false;
        data.temperature = 0.0f;
        data.humidity = 0.0f;
    } else {
        data.isValid = true;
    }

    return data;
}

