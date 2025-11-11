import { Body, Controller, Get, Post } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceDto } from "./dto/device.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('devices')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService){}

    @Get()
    async getAllDevices(): Promise<DeviceDto[]> {
        return await this.deviceService.getAllDevices();
    }

    @ApiOperation({ summary: 'Create device' })
    @ApiResponse({ status: 200, description: 'Create device successfully.'})
    @ApiBody({ type: DeviceDto})
    @Post()
    async createDevice(@Body() body: DeviceDto): Promise<DeviceDto> {
        return await this.deviceService.createDevice(body);
    }

}