import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class HouseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "test", description: "Tên nhà" })
    name: string;

    // @ApiProperty({ example: "68769ba7dbcc", description: "House ID" })
    // @IsString()
    // home_id: string;

    @ApiProperty({ example: "Thường Tín, Hà Nội", description: "Địa chỉ của nhà"})
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty({ example: "Mô tả nhà", description: "Mô tả nhà"})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ example: 1, description: "Account ID"})
    @IsNotEmpty()
    accountId: number;
}