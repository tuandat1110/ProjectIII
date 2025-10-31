import { Body, Controller, Get, Post } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomDto } from "./dto/room.dto";


@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    async getAll(): Promise<RoomDto[]> {
        return await this.roomService.getAll();
    }

    @Post()
    async createRoom(@Body() roomDto: RoomDto): Promise<RoomDto> {
        return await this.roomService.createRoom(roomDto);
    }
}