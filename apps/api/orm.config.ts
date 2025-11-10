import { DataSource } from "typeorm";
import { configService } from "./src/config/config.service";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configService.getValue("DB_HOST"),
  port: parseInt(configService.getValue("DB_PORT")),
  username: configService.getValue("DB_USERNAME"),
  // password: configService.getValue("DB_PASSWORD"),
  database: configService.getValue("DB_NAME"),
  logging: true,
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/*{.ts,.js}"],
  migrationsTableName: "db_migrations",
  namingStrategy: new SnakeNamingStrategy(),
});
