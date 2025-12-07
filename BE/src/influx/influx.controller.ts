import { Controller, Get, Query } from '@nestjs/common';
import { InfluxdbService } from './influx.service';

@Controller('influx')
export class InfluxdbController {
  constructor(private readonly influxService: InfluxdbService) {}

  @Get('history')
  async getHistory(@Query('room') room: string, @Query('minutes') minutes: string) {
    return this.influxService.getSensorHistory(room || 'livingroom', parseInt(minutes) || 60);
  }
}
