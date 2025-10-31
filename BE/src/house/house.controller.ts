import { Body, Controller, Get, Post } from "@nestjs/common";
import { HouseService } from "./house.service";
import { HouseDto } from "./dto/house.dto";

@Controller('houses')
export class HouseController {
    constructor(private readonly houseService: HouseService) {}

    @Get()
    async getAll(): Promise<HouseDto[]> {
        return await this.houseService.getAll();
    }

    @Post()
    async createHouse(@Body() houseDto: HouseDto): Promise<HouseDto> {
        return await this.houseService.createHouse(houseDto);
    }
}