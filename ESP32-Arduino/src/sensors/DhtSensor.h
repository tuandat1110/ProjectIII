#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H
#include "DHT.h"
#include "DhtData.h"

class DhtSensor {
private: 
    DHT dht;
    uint8_t _pin;
    uint8_t _type;

public:
    //constructor
    DhtSensor(uint8_t pin, uint8_t type);
    void begin();
    DhtData read();
};

#endif