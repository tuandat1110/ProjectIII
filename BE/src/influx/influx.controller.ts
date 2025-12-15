import { Controller, Get, Query } from '@nestjs/common';
import { InfluxdbService } from './influx.service';

@Controller('influx')
export class InfluxdbController {
  constructor(private readonly influxService: InfluxdbService) {}

  @Get('history')
  async getHistory(
    @Query('durationMinutes') durationMinutes: number, 
    @Query('aggregateSeconds') aggregateSeconds: number
  ) {
    return this.influxService.getSensorHistory(durationMinutes,aggregateSeconds);
  }
}
