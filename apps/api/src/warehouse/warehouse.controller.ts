import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dto/update-warehouse.dto";

@Controller("warehouses")
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    try {
      const warehouse = await this.warehouseService.create(createWarehouseDto);
      return warehouse;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Get()
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
    @Query("search") search = ""
  ) {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const data = await this.warehouseService.findAll({
        page: pageNumber,
        limit: limitNumber,
        search: search.toString(),
      });

      return {
        data: data.items,
        meta: {
          total: data.total,
          page: pageNumber,
          limit: limitNumber,
        },
      };
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const warehouse = await this.warehouseService.findOne(+id);

      return warehouse;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto
  ) {
    try {
      const warehouse = await this.warehouseService.update(
        +id,
        updateWarehouseDto
      );
      return warehouse;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.warehouseService.remove(+id);
      return true;
    } catch (e) {
      //add log later
      throw e;
    }
  }
}
