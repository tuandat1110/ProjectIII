import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { FcmService } from './fcm.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('register')
    async registerToken(
        @Req() req: any,
        @Body() dto: RegisterFcmTokenDto,
    ) {
        const userId = req.user.id; // từ JWT
        return this.fcmService.registerToken(userId, dto);
    }
}
