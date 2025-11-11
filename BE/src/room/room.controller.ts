import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomDto } from "./dto/room.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";


@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    async getAll(): Promise<RoomDto[]> {
        return await this.roomService.getAll();
    }

    @ApiOperation({ summary: 'Create room' })
    @ApiResponse({ status: 200, description: 'Create room successfully'})
    @ApiBody({ type: RoomDto })
    @Post()
    async createRoom(@Body() roomDto: RoomDto): Promise<RoomDto> {
        return await this.roomService.createRoom(roomDto);
    }

    @Put('/:id')
    async updateRoom(@Param('id') id: number,@Body() roomDto: RoomDto): Promise<RoomDto> {
        return await this.roomService.updateRoom(roomDto, id);
    }
}