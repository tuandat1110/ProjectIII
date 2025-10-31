import { Injectable } from "@nestjs/common";
import { HouseDto } from "./dto/house.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class HouseService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<HouseDto[]> {
        return await this.prisma.house.findMany();
    }

    async createHouse(houseDto: HouseDto): Promise<HouseDto> {
        return await this.prisma.house.create({
            data: {
                ...houseDto
            }
        })
    }


}