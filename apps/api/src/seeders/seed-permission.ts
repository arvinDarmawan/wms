import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { DataSource } from "typeorm";
import { PermissionEntity } from "src/role/permission.entity";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = appContext.get(DataSource);
    const repo = dataSource.getRepository(PermissionEntity);

    const permissions = [
      { name: "warehouse.read" },
      { name: "warehouse.create" },
      { name: "warehouse.update" },
      { name: "warehouse.delete" },
      { name: "user.read" },
      { name: "user.create" },
      { name: "user.update" },
      { name: "user.delete" },
      { name: "customer.read" },
      { name: "customer.create" },
      { name: "customer.update" },
      { name: "customer.delete" },
      { name: "uom.read" },
      { name: "uom.create" },
      { name: "uom.update" },
      { name: "uom.delete" },
    ];

    const existing = await repo.find();
    if (existing.length === 0) {
      await repo.insert(permissions);
      console.log("Permission seeded successfully!");
    } else {
      console.log("Permission already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding permissions:", error);
  } finally {
    await appContext.close();
    process.exit(0);
  }
}

bootstrap();
