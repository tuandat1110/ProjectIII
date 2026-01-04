import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { MqttService } from './mqtt/mqtt.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { AuthModule } from './auth/auth.module';
import { HouseModule } from './house/house.module';
import { RoomModule } from './room/room.module';
import { WebsocketModule } from './websocket/websocket.module';
import { MqttModule } from './mqtt/mqtt.module';
import { DeviceModule } from './device/device.module';
import { InfluxModule } from './influx/influx.module';
import { UploadModule } from './upload/upload.module';
import { FcmModule } from './fcm/fcm.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    AccountModule, 
    PrismaModule, 
    SensorModule, 
    AuthModule, 
    HouseModule, 
    RoomModule,
    WebsocketModule,
    MqttModule,
    DeviceModule,
    InfluxModule,
    UploadModule,
    FcmModule,
    FirebaseModule
  ], 
  controllers: [AppController],
  providers: [AppService, MqttService, WebsocketGateway],
})
export class AppModule {}
