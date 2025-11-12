import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./datasource/typeorm.module";
import { UserModule } from "./user/user.module";
import { WarehouseModule } from "./warehouse/warehouse.module";

@Module({
  imports: [TypeOrmModule, UserModule, WarehouseModule],
})
export class AppModule {}
