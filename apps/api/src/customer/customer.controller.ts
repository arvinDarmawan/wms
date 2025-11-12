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
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customerService.create(createCustomerDto);
      return customer;
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

      const data = await this.customerService.findAll({
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
      const customer = await this.customerService.findOne(+id);

      return customer;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    try {
      const customer = await this.customerService.update(
        +id,
        updateCustomerDto
      );
      return customer;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.customerService.remove(+id);
      return true;
    } catch (e) {
      //add log later
      throw e;
    }
  }
}
