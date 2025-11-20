import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
    imports: [WebsocketModule, MqttModule],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService]
})
export class DeviceModule {}