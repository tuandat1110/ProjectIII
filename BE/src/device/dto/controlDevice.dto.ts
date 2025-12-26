import { IsNotEmpty, IsString } from "class-validator";

export class ControlDeviceDto {
    @IsNotEmpty()
    @IsString()
    mac: string;

    @IsNotEmpty()
    @IsString()
    roomId: string;

    @IsNotEmpty()
    pin: number;

    @IsNotEmpty()
    status: boolean;

    @IsNotEmpty()
    houseId: string;
}