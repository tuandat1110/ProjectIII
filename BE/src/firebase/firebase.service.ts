import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from 'src/prisma/prisma.service';
import { base62ToUuid } from 'src/utils/utils';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly prisma: PrismaService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          require('../../firebase/firebase-service-account.json'),
        ),
      });
      this.logger.log('Firebase Admin initialized');
    }
  }

  async sendFireAlert(tokens: string[], payload: {
    homeId: string;
    roomId: string;
  }) {
    if (!tokens || tokens.length === 0) {
      this.logger.warn('No FCM tokens to send');
      return;
    }

    const home = await this.prisma.house.findUnique({
      where: { id: base62ToUuid(payload.homeId) },
    });

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: ' CẢNH BÁO CHÁY',
        body: `Phát hiện cháy tại nhà: ${home?.name}`,
      },
      data: {
        type: 'FIRE_ALERT',
        homeId: payload.homeId,
        roomId: payload.roomId,
      },
    });

    this.logger.log(`Sent fire alert to ${tokens.length} devices`);
  }
}
