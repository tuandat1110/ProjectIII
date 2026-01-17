# ProjectIII

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) [![build](https://github.com/tuandat1110/ProjectIII/actions/workflows/ci.yml/badge.svg)](https://github.com/tuandat1110/ProjectIII/actions/workflows/ci.yml)

ProjectIII is an IoT home automation project composed of three main parts:
- A NestJS backend that handles authentication, MQTT messaging, device control, and CRUD operations for homes, rooms, and LEDs.
- ESP32 firmware that reads sensors and responds to commands (LED control).
- A React Native mobile app that renders real-time data and provides controls for users.

This repository contains source for the backend, firmware, and mobile app and helper scripts to run the stack locally.

Table of Contents
- [Repository layout](#repository-layout)
- [Key features](#key-features)
- [Architecture overview](#architecture-overview)
- [MQTT topics and payload examples](#mqtt-topics-and-payload-examples)
- [Getting started (quick)](#getting-started-quick)
- [Using docker-compose for dev](#using-docker-compose-for-dev)
- [Simulating ESP32 telemetry locally](#simulating-esp32-telemetry-locally)
- [CI](#ci)
- [Contributing](#contributing)
- [License](#license)

Repository layout

- `/backend` - NestJS server (authentication, MQTT client, REST / WebSocket API, DB)
- `/firmware` - ESP32 firmware (sensor readings, MQTT publish/subscribe, control handlers)
- `/mobile` or `/app` - React Native frontend (UI + realtime display + control)
- `/scripts` - helper scripts (docker-compose helpers, simulation scripts)
- `/.github/workflows` - CI workflows

Key features

- NestJS backend
  - Authentication (JWT)
  - MQTT client to receive sensor telemetry and publish device commands
  - REST CRUD endpoints for Home, Room, LED, Device
  - Optional WebSocket / Server-Sent Events for realtime UI updates
  - Persistent storage (Postgres)
- ESP32 firmware
  - Reads sensors (temperature, humidity, light)
  - Publishes telemetry to MQTT topics
  - Subscribes to command topics to toggle/dim LEDs
- React Native frontend
  - Real-time data visualization and controls
  - Authentication and device management

Architecture overview

1. ESP32 devices connect to local Wi-Fi and publish telemetry to an MQTT broker.
2. NestJS backend subscribes to those topics, processes telemetry, and stores them in the database.
3. Backend exposes REST APIs and WebSocket for live updates.
4. React Native app authenticates with the backend and fetches data via REST and/or listens for realtime events; it can send commands which the backend publishes to MQTT.

MQTT topics and payload examples

- Telemetry: `sensor/{homeId}/{roomId}/{deviceId}/telemetry`
- Command: `command/{homeId}/{roomId}/{deviceId}/led/set`
- Status/heartbeat: `status/{homeId}/{roomId}/{deviceId}`

Telemetry payload example:

```json
{
  "deviceId": "esp32-01",
  "temperature": 26.4,
  "humidity": 55.1,
  "light": 120,
  "timestamp": "2026-01-17T12:00:00Z"
}
```

Command payload example:

```json
{
  "state": "ON",
  "brightness": 128
}
```

Getting started (quick)

Prerequisites
- Node.js 16+
- npm or yarn
- Docker & Docker Compose (recommended for local MQTT broker and DB)
- PlatformIO or ESP-IDF for flashing ESP32
- Android Studio / Xcode or Expo for React Native

Backend (NestJS) quick start

1. cd backend
2. Copy `.env.example` to `.env` and update values
3. Install dependencies: `npm install`
4. Run migrations if used (TypeORM / Prisma)
5. Start server: `npm run start:dev`

ESP32 firmware quick start

1. cd firmware
2. Edit `platformio.ini` or firmware config with Wi-Fi and MQTT credentials
3. Build & flash using PlatformIO: `platformio run --target upload`

React Native app quick start

1. cd mobile
2. Install: `npm install`
3. If using Expo: `expo start` or RN CLI: `npx react-native run-android`

Using docker-compose for dev

A docker-compose file is included at `docker-compose.yml` to start a local MQTT broker (Mosquitto) and Postgres DB for development. Example:

```bash
# start services
docker-compose up -d

# stop services
docker-compose down
```

Simulating ESP32 telemetry locally

A small Node.js simulator is provided at `scripts/simulate.js` that publishes example telemetry to the MQTT broker for local testing. Configure the `.env` values or pass broker URL on the command line.

CI

A basic GitHub Actions workflow is provided at `.github/workflows/ci.yml`. It runs on pushes and pull requests to `main` and will install dependencies and run tests for each package/folder that has a `package.json`.

Contributing

See `CONTRIBUTING.md` for contribution guidelines, commit message style, and PR expectations.

License

This project is licensed under the MIT License - see the `LICENSE` file for details.
