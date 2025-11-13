import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { RoleEntity } from "./role.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {}

  async findAll() {
    const items = await this.roleRepository.find({
      where: {
        deletedAt: null,
      },
      order: { id: "ASC" },
    });

    return { items };
  }
}
