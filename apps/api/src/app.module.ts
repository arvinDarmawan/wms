import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./datasource/typeorm.module";
import { UserModule } from "./user/user.module";
import { WarehouseModule } from "./warehouse/warehouse.module";
import { CustomerModule } from "./customer/customer.module";
import { UomModule } from "./uom/uom.module";
import { AuthModule } from "./auth/auth.module";
import { JwtGuard } from "./auth/guards/jwt.guard";
import { JwtStrategy } from "./auth/strategy/jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    UserModule,
    RoleModule,
    WarehouseModule,
    CustomerModule,
    UomModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
