import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class DeviceDto {
    @ApiProperty({ example: "Đèn phòng khách", description: "Tên đèn"})
    @IsString()
    name: string;
    
    @ApiProperty({ example:"Đèn", description: "Loại thiết bị"})
    @IsString()
    type: string;

    @ApiProperty({ example: 2, description: "Chân pin của đèn"})
    @IsString()
    pin: string;

    @ApiProperty({ example:"68769ba7dbcc", description: "Địa chỉ ip"})
    @IsString()
    macAddress: string;

    @IsBoolean()
    @ApiProperty({ example: false, description: "Trạng thái của đèn"})
    status: boolean;

    @ApiProperty({ example: 1, description: "Room ID"})
    @IsNotEmpty()
    roomId: string;
}