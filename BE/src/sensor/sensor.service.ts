import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorData } from 'src/types/sensor.interface';

@Injectable()
export class SensorService {
//   private prisma = new PrismaClient();
    constructor(private prisma: PrismaService){}

  // async saveSensorData(data: {temperature: number, humidity: number}) {
  //   const { temperature, humidity } = data;

  //   await this.prisma.sensor.create({
  //       data: {
  //           temperature,
  //           humidity,
  //       }
  //   });

  //   console.log('Saved data:', data);
  // }

  // async getAll(): Promise<SensorData[]> {
  //   const data:SensorData[] = await this.prisma.sensor.findMany();
  //   return data;
  // }
}
