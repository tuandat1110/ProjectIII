import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';

@Injectable()
export class FcmService {
  constructor(private prisma: PrismaService) {}

  async registerToken(userId: number, dto: RegisterFcmTokenDto) {
    const { token, platform, houseId } = dto;

    await this.prisma.fcmToken.upsert({
      where: { token },
      update: {
        accountId: userId,
        houseId,
        platform,
        updatedAt: new Date(),
      },
      create: {
        token,
        platform,
        accountId: userId,
        houseId,
      },
    });

    return { message: 'FCM token registered successfully' };
  }
}
