import { DataSource } from "typeorm";
import { configService } from "../config/config.service";
import { Global, Module } from "@nestjs/common";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          const dataSource = new DataSource({
            type: "postgres",
            host: configService.getValue("DB_HOST"),
            port: parseInt(configService.getValue("DB_PORT")),
            username: configService.getValue("DB_USERNAME"),
            // password: configService.getValue("DB_PASSWORD"),
            database: configService.getValue("DB_NAME"),
            logging: true,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
            namingStrategy: new SnakeNamingStrategy(),
          });
          await dataSource.initialize();
          console.log("Database connected successfully");
          return dataSource;
        } catch (error) {
          console.log("Error connecting to database");
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
