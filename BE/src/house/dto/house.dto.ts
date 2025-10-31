import { IsNotEmpty, IsString } from "class-validator";


export class HouseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    address: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    accountId: number;
}