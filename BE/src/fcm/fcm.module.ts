import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';

@Module({
  controllers: [FcmController],
  providers: [FcmService, PrismaService],
  exports: [FcmService],
})
export class FcmModule {}
