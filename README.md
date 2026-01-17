# ProjectIII

ProjectIII is an IoT home automation project that includes a NestJS backend, ESP32 firmware, and a React Native mobile app. The backend handles authentication, reads sensor data via MQTT, controls LEDs, and provides CRUD APIs for homes, rooms, and LEDs. The ESP32 firmware reads sensors and responds to control commands (LEDs). The React Native app renders real-time data for users and allows control of devices.

## Repository structure (typical)

- /backend - NestJS server (auth, MQTT client, REST API)
- /firmware - ESP32 firmware (sensor reading, LED control)
- /mobile or /app - React Native frontend
- /scripts - helper scripts (docker, setup)

Adjust paths above if your repository layout differs.

## Features

- NestJS backend  
  - Authentication (JWT or session-based)  
  - MQTT client to read sensor data and publish commands  
  - LED control logic  
  - CRUD APIs for Home, Room, and LED resources  
- ESP32 firmware  
  - Periodically reads sensors (e.g., temperature, humidity, light)  
  - Publishes sensor data to MQTT topics  
  - Subscribes to command topics to toggle or dim LEDs  
- React Native frontend  
  - Real-time data visualization  
  - Controls to toggle LEDs and configure devices

## Architecture overview

1. ESP32 devices connect to local Wi-Fi and publish sensor readings to an MQTT broker.
2. The NestJS backend subscribes to relevant MQTT topics, processes messages, and stores data in the database.
3. The backend exposes REST APIs and (optionally) WebSocket endpoints for the frontend.
4. The React Native app consumes the API and/or receives real-time updates to show sensor values and control devices.

MQTT topic examples (customize to your implementation):

- sensor/{homeId}/{roomId}/{deviceId}/telemetry
- command/{homeId}/{roomId}/{deviceId}/led/set
- status/{homeId}/{roomId}/{deviceId}

## Getting started

### Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- Docker & Docker Compose (optional, for MQTT broker and database)
- ESP32 toolchain (PlatformIO or ESP-IDF) to build and flash firmware
- Android Studio / Xcode or Expo for running the React Native app

### Backend (NestJS)

1. cd backend
2. Copy `.env.example` to `.env` and fill required values (see example below).
3. Install dependencies: `npm install` or `yarn`.
4. Run migrations if applicable (TypeORM / Prisma). Example: `npm run typeorm:migrate`.
5. Start the server: `npm run start:dev`.

Example environment variables (adjust to your implementation):

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://user:pass@localhost:5432/projectiii
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=
```

### ESP32 firmware

1. cd firmware/esp32
2. Configure Wi-Fi and MQTT credentials in the firmware config (often in `config.h` or environment file).
3. Build and flash using PlatformIO or ESP-IDF. Example with PlatformIO:
   - `platformio run --target upload`
4. Monitor serial output to confirm sensor readings and MQTT connection.

MQTT telemetry example payload (JSON):

```
{
  "deviceId": "esp32-01",
  "temperature": 26.4,
  "humidity": 55.1,
  "light": 120,
  "timestamp": "2026-01-17T12:00:00Z"
}
```

### React Native app

1. cd mobile
2. Install dependencies: `npm install` or `yarn`.
3. If using Expo: `expo start`.
4. If using React Native CLI: run on a device/emulator: `npx react-native run-android` or `npx react-native run-ios`.
5. Configure the app with the backend URL and any API keys in a config file or environment variables.

## API (examples)

The backend exposes CRUD endpoints for resources. Example endpoints:

- POST /auth/login
- GET /homes
- POST /homes
- GET /homes/:homeId/rooms
- POST /homes/:homeId/rooms
- GET /rooms/:roomId/leds
- POST /rooms/:roomId/leds
- POST /devices/:deviceId/command (to send MQTT command)

Adjust the exact routes to match your implementation.

## MQTT topic and payload recommendations

- Telemetry topic: `sensor/{home}/{room}/{device}/telemetry` — payload is JSON with sensor values
- Command topic: `command/{home}/{room}/{device}/led/set` — payload example: `{"state": "ON", "brightness": 128}`
- Status/heartbeat topic: `status/{home}/{room}/{device}` — device publishes periodically to indicate it's online

## Development tips

- Use a local MQTT broker (e.g., Eclipse Mosquitto) during development and Docker Compose to spin up broker + DB.
- Add logging to MQTT message handlers to make debugging easier.
- Simulate ESP32 messages with a simple Node.js script publishing JSON payloads to the broker.
- Secure your MQTT broker in production with authentication and TLS.

## Contributing

Contributions are welcome. Please open an issue or a pull request describing the change.

## License

Specify your license here (e.g., MIT).

## Contact

For questions, reach out to the maintainers or open an issue in this repository.