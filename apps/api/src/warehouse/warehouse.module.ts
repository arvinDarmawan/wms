import { Module } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { WarehouseController } from "./warehouse.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseEntity } from "./warehouse.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseEntity])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
