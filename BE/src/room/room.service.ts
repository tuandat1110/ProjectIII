import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomDto } from "./dto/room.dto";
import { DeviceDto } from "src/device/dto/device.dto";

@Injectable()
export class RoomService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<RoomDto[]> {
        return await this.prisma.room.findMany();
    }

    async createRoom(roomDto: RoomDto): Promise<RoomDto> {
        return await this.prisma.room.create({
            data: {
                ...roomDto,
            }
        });
    }

    async updateRoom(body: RoomDto,id: number | undefined): Promise<RoomDto> {
        return await this.prisma.room.update({
            where: {
                id: id
            },
            data: {
                ...body
            }
        })
    }

    async getAllDeviceById(id: number): Promise<DeviceDto[]> {
        return await this.prisma.device.findMany({
            where: {
                roomId: id,
            }
        })
    }

}