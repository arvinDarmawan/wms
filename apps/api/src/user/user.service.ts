import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from "bcrypt";

interface FindAllOptions {
  page: number;
  limit: number;
  search: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  private generateRandomPassword(length = 10): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException(
        "Email already registered before",
        HttpStatus.BAD_REQUEST
      );
    }

    // Generate a random password
    const randomPassword = this.generateRandomPassword();

    // Hash the generated password
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });

    return this.userRepository.save(newUser);
  }

  async findAll(options: FindAllOptions) {
    const { page, limit, search } = options;

    const [items, total] = await this.userRepository.findAndCount({
      where: {
        ...(search ? { fullName: Like(`%${search}%`) } : {}),
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<UserEntity> {
    const data = await this.userRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data) {
      throw new HttpException("User not found", 404);
    }
    return data;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const data = await this.userRepository.findOne({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!data) {
      throw new HttpException("User not found", 404);
    }
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    const data = this.userRepository.merge(existingUser, updateUserDto);

    return await this.userRepository.save(data);
  }

  async remove(id: number): Promise<UserEntity> {
    const existingUser = await this.findOne(id);

    await this.userRepository.softDelete(id);

    return existingUser;
  }
}
