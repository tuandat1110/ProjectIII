import { Module } from '@nestjs/common';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';

@Module({
    controllers: [HouseController],
    providers: [HouseService],
    exports: [HouseService],
})
export class HouseModule {}