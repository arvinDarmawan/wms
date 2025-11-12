import { HttpException, Injectable } from "@nestjs/common";
import { CreateUomDto } from "./dto/create-uom.dto";
import { UpdateUomDto } from "./dto/update-uom.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { UomEntity } from "./uom.entity";

interface FindAllOptions {
  page: number;
  limit: number;
  search: string;
}

@Injectable()
export class UomService {
  constructor(
    @InjectRepository(UomEntity)
    private readonly uomRepository: Repository<UomEntity>
  ) {}

  async create(createUomDto: CreateUomDto): Promise<UomEntity> {
    const data = this.uomRepository.create(createUomDto);

    return this.uomRepository.save(data);
  }

  async findAll(options: FindAllOptions) {
    const { page, limit, search } = options;

    const [items, total] = await this.uomRepository.findAndCount({
      where: {
        ...(search ? { name: Like(`%${search}%`) } : {}),
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<UomEntity> {
    const data = await this.uomRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data) {
      throw new HttpException("Uom Not Found", 404);
    }
    return data;
  }

  async update(id: number, updateUomDto: UpdateUomDto): Promise<UomEntity> {
    const existingUom = await this.findOne(id);
    const data = this.uomRepository.merge(existingUom, updateUomDto);

    return await this.uomRepository.save(data);
  }

  async remove(id: number): Promise<UomEntity> {
    const existingUom = await this.findOne(id);

    await this.uomRepository.softDelete(id);

    return existingUom;
  }
}
