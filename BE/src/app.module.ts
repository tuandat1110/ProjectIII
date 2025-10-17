import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [AccountModule, PrismaModule, SensorModule], //  PrismaService lấy từ đây
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
