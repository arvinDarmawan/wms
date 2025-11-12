import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./datasource/typeorm.module";
import { UserModule } from "./user/user.module";
import { WarehouseModule } from "./warehouse/warehouse.module";
import { CustomerModule } from "./customer/customer.module";

@Module({
  imports: [TypeOrmModule, UserModule, WarehouseModule, CustomerModule],
})
export class AppModule {}
