import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { DataSource } from "typeorm";
import { RoleEntity } from "src/role/role.entity";

async function bootstrap() {
  // 1️⃣ Create Nest application context (no HTTP server)
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    // 2️⃣ Get the existing database connection
    const dataSource = appContext.get(DataSource);
    const repo = dataSource.getRepository(RoleEntity);

    // 3️⃣ Define your roles
    const roles = [
      { name: "Admin" },
      { name: "Warehouse Manager" },
      { name: "Warehouse Staff" },
    ];

    // 4️⃣ Check if roles already exist
    const existing = await repo.find();
    if (existing.length === 0) {
      await repo.insert(roles);
      console.log("✅ Roles seeded successfully!");
    } else {
      console.log("⚠️ Roles already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
  } finally {
    // 5️⃣ Close the Nest application context
    await appContext.close();
    process.exit(0);
  }
}

bootstrap();
