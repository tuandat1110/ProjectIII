import { Injectable } from "@nestjs/common";
import { HouseDto } from "./dto/house.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomDto } from "src/room/dto/room.dto";

@Injectable()
export class HouseService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<HouseDto[]> {
        return await this.prisma.house.findMany();
    }

    async createHouse(houseDto: HouseDto): Promise<HouseDto> {
        //console.log(this.prisma.house);
        return await this.prisma.house.create({
            data: {
                ...houseDto
            }
        })
    }

    async updateHouse(id: number, body: HouseDto): Promise<HouseDto> {
        return await this.prisma.house.update({
            where: {
                id: id
            },
            data: {
                ...body,
            }
        })
    }

    async deleteHouse(id: number): Promise<HouseDto> {
        return await this.prisma.house.delete({
            where: {
                id: id,
            },
        })
    }

    async getAllRoomsById(id: number): Promise<RoomDto[]> {
        const rooms = await this.prisma.room.findMany({
            where: {
                houseId: id,
            }
        });
        return rooms;
    }
}