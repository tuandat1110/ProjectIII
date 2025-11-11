import { PrismaService } from "src/prisma/prisma.service";
import { DeviceDto } from "./dto/device.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeviceService {
    constructor(private readonly prisma: PrismaService) {}

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
}