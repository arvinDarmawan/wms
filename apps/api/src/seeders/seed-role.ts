import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { DataSource } from "typeorm";
import { RoleEntity } from "src/role/role.entity";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = appContext.get(DataSource);
    const repo = dataSource.getRepository(RoleEntity);

    const roles = [
      { name: "Admin" },
      { name: "Warehouse Manager" },
      { name: "Warehouse Staff" },
    ];

    const existing = await repo.find();
    if (existing.length === 0) {
      await repo.insert(roles);
      console.log("Roles seeded successfully!");
    } else {
      console.log("Roles already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding roles:", error);
  } finally {
    await appContext.close();
    process.exit(0);
  }
}

bootstrap();
