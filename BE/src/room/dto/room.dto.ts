import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

export class RoomDto {
    @IsString()
    name: string;

    @Optional()
    @IsString()
    description: string;

    houseId: number;
}