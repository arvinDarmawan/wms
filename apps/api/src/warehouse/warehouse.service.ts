import { HttpException, Injectable } from "@nestjs/common";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dto/update-warehouse.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { WarehouseEntity } from "./warehouse.entity";

interface FindAllOptions {
  page: number;
  limit: number;
  search: string;
}

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>
  ) {}

  async create(
    createWarehouseDto: CreateWarehouseDto
  ): Promise<WarehouseEntity> {
    // Count total warehouses
    const totalWarehouses = await this.warehouseRepository.count();

    // Generate new number
    const warehouseNumber = totalWarehouses + 1;

    const data = this.warehouseRepository.create({
      ...createWarehouseDto,
      code: `WH-${warehouseNumber.toString().padStart(3, "0")}`,
    });

    return this.warehouseRepository.save(data);
  }

  async findAll(options: FindAllOptions) {
    const { page, limit, search } = options;

    const [items, total] = await this.warehouseRepository.findAndCount({
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

  async findOne(id: number): Promise<WarehouseEntity> {
    const data = await this.warehouseRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data) {
      throw new HttpException("Warehouse Not Found", 404);
    }
    return data;
  }

  async update(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto
  ): Promise<WarehouseEntity> {
    const existingWarehouse = await this.findOne(id);
    const data = this.warehouseRepository.merge(
      existingWarehouse,
      updateWarehouseDto
    );

    return await this.warehouseRepository.save(data);
  }

  async remove(id: number): Promise<WarehouseEntity> {
    const existingWarehouse = await this.findOne(id);

    await this.warehouseRepository.softDelete(id);

    return existingWarehouse;
  }
}
