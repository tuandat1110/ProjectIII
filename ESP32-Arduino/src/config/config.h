#pragma once

 // WiFi
const char *ssid = "Tang 2";
const char *password = "11102004";

// MQTT broker
//"290a5491b2bd4ac1aae8fa40f2fcd698.s1.eu.hivemq.cloud"
const char *mqtt_server = "192.168.0.102";
const int mqtt_port = 1883;
const char *mqtt_user = "tuandat1110";
const char *mqtt_password = "Dat11102004";

//pin
#define DHTPIN 23
#define DHTTYPE DHT11
#define LED_PIN 2
#define PIR_PIN 14
#define BUZZER_PIN 15
#define RESET_BUTTON_PIN 12 
#define RESET_HOLD_TIME 3000

//i2c
#define SDA_PIN 21
#define SCL_PIN 22

//oled
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
