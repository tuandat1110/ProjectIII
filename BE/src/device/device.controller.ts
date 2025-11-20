import { Body, Controller, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceDto } from "./dto/device.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { MqttService } from "src/mqtt/mqtt.service";
import { ControlDeviceDto } from "./dto/controlDevice.dto";

@Controller('devices')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly ws: WebsocketGateway,
        private readonly mqtt: MqttService
    ){}

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

    @ApiOperation({ summary: 'Update device' })
    @ApiResponse({ status: 200, description: 'Update device successfully.'})
    @ApiBody({ type: DeviceDto})
    @Patch("/:id")
    async updateDevice(@Param('id') id: number,@Body() body:DeviceDto): Promise<DeviceDto> {
        return await this.deviceService.updateDevice(id,body);
    }

    @Patch('/:deviceId/command')
    @HttpCode(202)
    sendCommand(
        @Param('deviceId') deviceId: string,
        @Body() body: ControlDeviceDto
    ) {
        console.log("hihihihihihi");
        // topic chuẩn: home/{mac}/{roomId}/{deviceId}/cmd
        const topic = `home/${body.mac}/${body.roomId}/${deviceId}/cmd`;
        // payload gửi lên ESP32
        const payload = `${body.pin}:${body.status}`;
        this.mqtt.publish(topic, payload, { qos: 1, retain: false });
        console.log(`Topic: ${topic}`);
        return { status: 'accepted', deviceId };
    }
}