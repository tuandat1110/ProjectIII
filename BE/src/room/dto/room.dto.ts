import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RoomDto {
    @IsString()
    @ApiProperty({ example: "Phòng khách", description: "Tên phòng"})
    name: string;

    @ApiProperty({ example: "Mô tả về phòng", description: "Mô tả về phòng"})
    @Optional()
    @IsString()
    description: string;

    @ApiProperty({ example: 1, description: "House ID"})
    @IsNotEmpty()
    houseId: string;

    @IsOptional()
    image: string | null;
}