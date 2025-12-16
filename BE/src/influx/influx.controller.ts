import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InfluxdbService } from './influx.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('influx')
export class InfluxdbController {
  constructor(private readonly influxService: InfluxdbService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('history')
  async getHistory(
    @Query('durationMinutes') durationMinutes: number, 
    @Query('aggregateSeconds') aggregateSeconds: number
  ) {
    return this.influxService.getSensorHistory(durationMinutes,aggregateSeconds);
  }
}
