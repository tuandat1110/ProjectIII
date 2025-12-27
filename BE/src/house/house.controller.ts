import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from "@nestjs/common";
import { HouseService } from "./house.service";
import { HouseDto } from "./dto/house.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RoomDto } from "src/room/dto/room.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('houses')
export class HouseController {
    constructor(private readonly houseService: HouseService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAll(@Request() req): Promise<HouseDto[]> {
        console.log(`Req: ${JSON.stringify(req.user)}`);
        return await this.houseService.getAll();
    }

    @Get('/:id/rooms')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async getAllRoomsById(@Param('id') id: string): Promise<RoomDto[]> {
        return await this.houseService.getAllRoomsById(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create house' })
    @ApiResponse({ status: 200, description: 'Create house successfully'})
    @ApiBody({ type: HouseDto })
    @Post()
    async createHouse(@Body() houseDto: HouseDto): Promise<HouseDto> {
        return await this.houseService.createHouse(houseDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update house' })
    @ApiResponse({ status: 200, description: 'Update house successfully'})
    @ApiBody({ type: HouseDto })
    @Put('/:id')
    async updateHouse(@Param('id') id: string, @Body() body: HouseDto): Promise<HouseDto> {
        return await this.houseService.updateHouse(id,body);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete house' })
    @ApiResponse({ status: 200, description: 'Delete house successfully'})
    @Delete('/:id')
    async deleteHouse(@Param('id') id: string): Promise<HouseDto> {
        return await this.houseService.deleteHouse(id);
    }
}