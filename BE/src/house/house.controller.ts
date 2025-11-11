import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { HouseService } from "./house.service";
import { HouseDto } from "./dto/house.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RoomDto } from "src/room/dto/room.dto";

@Controller('houses')
export class HouseController {
    constructor(private readonly houseService: HouseService) {}

    @Get()
    async getAll(): Promise<HouseDto[]> {
        return await this.houseService.getAll();
    }

    @Get('/:id/rooms')
    async getAllRoomsById(@Param('id') id: number): Promise<RoomDto[]> {
        return await this.houseService.getAllRoomsById(id);
    }

    @ApiOperation({ summary: 'Create house' })
    @ApiResponse({ status: 200, description: 'Create house successfully'})
    @ApiBody({ type: HouseDto })
    @Post()
    async createHouse(@Body() houseDto: HouseDto): Promise<HouseDto> {
        return await this.houseService.createHouse(houseDto);
    }

    @ApiOperation({ summary: 'Update house' })
    @ApiResponse({ status: 200, description: 'Update house successfully'})
    @ApiBody({ type: HouseDto })
    @Put('/:id')
    async updateHouse(@Param('id') id: number, @Body() body: HouseDto): Promise<HouseDto> {
        return await this.houseService.updateHouse(id,body);
    }

    @ApiOperation({ summary: 'Delete house' })
    @ApiResponse({ status: 200, description: 'Delete house successfully'})
    @Delete('/:id')
    async deleteHouse(@Param('id') id: number): Promise<HouseDto> {
        return await this.houseService.deleteHouse(id);
    }
}