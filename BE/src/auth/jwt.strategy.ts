import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, 
            secretOrKey: "tuandat",
        });
    }

    // Hàm này sẽ được gọi sau khi token hợp lệ
    validate(payload: any) {
        return  { email: payload.email, id: payload.id, name: payload.name, role: payload.role, createdAt: payload.createdAt };
    }
}
