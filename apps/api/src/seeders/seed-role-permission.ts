import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { DataSource } from "typeorm";
import { RoleEntity } from "src/role/role.entity";
import { PermissionEntity } from "src/role/permission.entity";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = appContext.get(DataSource);
    const roleRepo = dataSource.getRepository(RoleEntity);
    const permissionRepo = dataSource.getRepository(PermissionEntity);

    // Seed roles
    const rolesData = [
      { name: "Admin" },
      { name: "Warehouse Manager" },
      { name: "Warehouse Staff" },
    ];

    let roles = await roleRepo.find();
    if (roles.length === 0) {
      roles = await roleRepo.save(rolesData);
      console.log("Roles seeded successfully!");
    } else {
      console.log("Roles already exist, skipping seeding.");
    }

    // Seed permissions
    const permissionsData = [
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

    let permissions = await permissionRepo.find();
    if (permissions.length === 0) {
      permissions = await permissionRepo.save(permissionsData);
      console.log("Permissions seeded successfully!");
    } else {
      console.log("Permissions already exist, skipping seeding.");
    }

    // 3Assign permissions to roles
    // Map role names to role entities
    const roleMap = Object.fromEntries(roles.map((r) => [r.name, r]));

    // Map permission names to permission entities
    const permMap = Object.fromEntries(permissions.map((p) => [p.name, p]));

    // Assign permissions
    // Admin & Warehouse Manager: all permissions
    const fullPermissions = Object.values(permMap);

    for (const roleName of ["Admin", "Warehouse Manager"]) {
      const role = roleMap[roleName];
      role.permissions = fullPermissions;
      await roleRepo.save(role);
    }

    // Warehouse Staff: only "read" permissions
    const readPermissions = Object.values(permMap).filter((p) =>
      p.name.endsWith(".read")
    );
    const staffRole = roleMap["Warehouse Staff"];
    staffRole.permissions = readPermissions;
    await roleRepo.save(staffRole);

    console.log("Role-permission assignments completed!");
  } catch (error) {
    console.error("Error seeding roles/permissions:", error);
  } finally {
    await appContext.close();
    process.exit(0);
  }
}

bootstrap();
