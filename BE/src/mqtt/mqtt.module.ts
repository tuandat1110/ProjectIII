import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [WebsocketModule, EventEmitterModule.forRoot(), WebsocketModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
