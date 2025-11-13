import { Controller, Get } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.roleService.findAll();

      return {
        data: data.items,
      };
    } catch (e) {
      //add log later
      throw e;
    }
  }
}
