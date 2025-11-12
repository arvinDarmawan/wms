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
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return user;
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

      const data = await this.userService.findAll({
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
      const user = await this.userService.findOne(+id);

      return user;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(+id, updateUserDto);
      return user;
    } catch (e) {
      //add log later
      throw e;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.userService.remove(+id);
      return true;
    } catch (e) {
      //add log later
      throw e;
    }
  }
}
