import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    // controllers: [AuthController],
    // providers: [AuthService],
})
export class AuthModule {}