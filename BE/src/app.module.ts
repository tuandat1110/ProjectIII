import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { MqttService } from './mqtt/mqtt.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AccountModule, PrismaModule, SensorModule, AuthModule], //  PrismaService lấy từ đây
  controllers: [AppController],
  providers: [AppService, MqttService, WebsocketGateway],
})
export class AppModule {}
