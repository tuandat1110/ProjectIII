import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomDto } from "./dto/room.dto";

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

}