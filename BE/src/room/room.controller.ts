import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomDto } from "./dto/room.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DeviceDto } from "src/device/dto/device.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async getAll(): Promise<RoomDto[]> {
        return await this.roomService.getAll();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create room' })
    @ApiResponse({ status: 200, description: 'Create room successfully'})
    @ApiBody({ type: RoomDto })
    @Post()
    async createRoom(@Body() roomDto: RoomDto): Promise<RoomDto> {
        return await this.roomService.createRoom(roomDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    async updateRoom(@Param('id') id: number,@Body() roomDto: RoomDto): Promise<RoomDto> {
        return await this.roomService.updateRoom(roomDto, id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('/:id/devices')
    async getAllDevicesById(@Param('id') id: number): Promise<DeviceDto[]> {
        return await this.roomService.getAllDeviceById(id);
    }
}