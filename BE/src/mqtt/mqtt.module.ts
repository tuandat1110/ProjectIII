import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InfluxModule } from 'src/influx/influx.module';

@Module({
  imports: [WebsocketModule, EventEmitterModule.forRoot(), WebsocketModule, InfluxModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
