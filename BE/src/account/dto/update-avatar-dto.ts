import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UpdateAvatarDto {
    @IsUrl()
    avatarUrl?: string;
}
