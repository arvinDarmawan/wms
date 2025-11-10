import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./datasource/typeorm.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [TypeOrmModule, UserModule],
})
export class AppModule {}
