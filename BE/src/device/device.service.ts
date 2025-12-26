import { PrismaService } from "src/prisma/prisma.service";
import { DeviceDto } from "./dto/device.dto";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { WebsocketGateway } from "src/websocket/websocket.gateway";

@Injectable()
export class DeviceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly wsGateway: WebsocketGateway,
    ) {}

    async getAllDevices(): Promise<DeviceDto[]>  {
        return await this.prisma.device.findMany();
    }

    async createDevice(body: DeviceDto): Promise<DeviceDto> {
        return await this.prisma.device.create({
            data: {
                ...body
            }
        })
    }

    async updateDevice(id:number, body: DeviceDto): Promise<DeviceDto> {
        return await this.prisma.device.update({
            where: {
                id: id,
            },
            data: {
                ...body,
            }
        })
    }

    async deleteDevice(id: number): Promise<any> {
        return await this.prisma.device.delete({
            where: { id: id }
        });
    }

    @OnEvent('device.state.changed')
    async handleDeviceState(event: { topic: string; payload: string }) {
        const { topic, payload } = event;
        // topic: home/{mac}/{homeId}/{roomId}/state
        const parts = topic.split('/');
        const deviceId = Number(parts[3]);
        const [pinStr, statusStr] = payload.split(':');
        const pin = Number(pinStr);
        const status = statusStr.toUpperCase() === 'ON'; 
        console.log(`Nhận trạng thái cho Device ID: ${deviceId}`);
        console.log(`Pin: ${pin}, Status: ${status}`);
    
        console.log(`Dang cap nhat db ....`);
        // Cập nhật DB
        await this.prisma.device.update({
            where: { id: deviceId },
            data: {
                status: status,
                lastUpdated: new Date(),
            },
        });
        // Nếu Device có nhiều pin: dùng JSON field (pinStates)
        // await this.prisma.device.update({
        //     where: { id: deviceId },
        //     data: {
        //         pinStates: {
        //             ...existingPinStates,
        //             [pin]: status
        //         }
        //     },
        // });

        // Gửi WebSocket realtime cho FE
        this.wsGateway.sendDeviceStateUpdate({
            deviceId,
            pin,
            status,
            updatedAt: new Date().toISOString()
        });
    }   
}