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
import { UomService } from "./uom.service";
import { CreateUomDto } from "./dto/create-uom.dto";
import { UpdateUomDto } from "./dto/update-uom.dto";

@Controller("uoms")
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  async create(@Body() createUomDto: CreateUomDto) {
    try {
      const uom = await this.uomService.create(createUomDto);
      return uom;
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

      const data = await this.uomService.findAll({
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
      const uom = await this.uomService.findOne(+id);

      return uom;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUomDto: UpdateUomDto) {
    try {
      const uom = await this.uomService.update(+id, updateUomDto);
      return uom;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.uomService.remove(+id);
      return true;
    } catch (e) {
      //add log later
      throw e;
    }
  }
}
