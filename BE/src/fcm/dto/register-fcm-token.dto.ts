import { IsString, IsOptional, IsIn } from 'class-validator';

export class RegisterFcmTokenDto {
  @IsString()
  token: string;

  @IsString()
  @IsIn(['android', 'ios', 'web'])
  platform: string;

  @IsOptional()
  @IsString()
  houseId?: string;
}
