import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  // Lắng nghe topic từ MQTT broker
    @EventPattern('sensor/dht11')
    async handleSensorData(@Payload() data: any) {
        console.log('Data received from MQTT:', data);
        await this.sensorService.saveSensorData(data);
    }

    @Get()
    async getAll() {
        return await this.sensorService.getAll();
    }



}
