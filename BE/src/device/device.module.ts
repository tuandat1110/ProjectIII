import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService]
})
export class DeviceModule {}