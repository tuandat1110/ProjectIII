import { Module } from "@nestjs/common";
import { InfluxdbService } from "./influx.service";
import { InfluxdbController } from "./influx.controller";

@Module({
    controllers: [InfluxdbController],
    providers: [InfluxdbService],
    exports: [InfluxdbService],
})
export class InfluxModule {}