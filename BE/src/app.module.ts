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

@Module({
  imports: [
    AccountModule, 
    PrismaModule, 
    SensorModule, 
    AuthModule, 
    HouseModule, 
    RoomModule
  ], 
  controllers: [AppController],
  providers: [AppService, MqttService, WebsocketGateway],
})
export class AppModule {}
