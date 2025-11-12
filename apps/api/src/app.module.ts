import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./datasource/typeorm.module";
import { UserModule } from "./user/user.module";
import { WarehouseModule } from "./warehouse/warehouse.module";
import { CustomerModule } from "./customer/customer.module";
import { UomModule } from "./uom/uom.module";

@Module({
  imports: [
    TypeOrmModule,
    UserModule,
    WarehouseModule,
    CustomerModule,
    UomModule,
  ],
})
export class AppModule {}
