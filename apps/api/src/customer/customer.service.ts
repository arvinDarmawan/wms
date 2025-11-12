import { HttpException, Injectable } from "@nestjs/common";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { CustomerEntity } from "./customer.entity";

interface FindAllOptions {
  page: number;
  limit: number;
  search: string;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    // Count total customers
    const totalCustomers = await this.customerRepository.count();

    // Generate new customer number
    const customerNumber = totalCustomers + 1;

    const data = this.customerRepository.create({
      ...createCustomerDto,
      code: `CUST-${customerNumber.toString().padStart(6, "0")}`,
    });

    return this.customerRepository.save(data);
  }

  async findAll(options: FindAllOptions) {
    const { page, limit, search } = options;

    const whereConditions: any = {
      deletedAt: null,
    };

    if (search) {
      whereConditions["OR"] = [
        { firstName: Like(`%${search}%`) },
        { lastName: Like(`%${search}%`) },
      ];
    }

    const [items, total] = await this.customerRepository.findAndCount({
      where: whereConditions["OR"]
        ? [
            { firstName: Like(`%${search}%`), deletedAt: null },
            { lastName: Like(`%${search}%`), deletedAt: null },
          ]
        : { deletedAt: null },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<CustomerEntity> {
    const data = await this.customerRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data) {
      throw new HttpException("Customer Not Found", 404);
    }
    return data;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerEntity> {
    const existingCustomer = await this.findOne(id);
    const data = this.customerRepository.merge(
      existingCustomer,
      updateCustomerDto
    );

    return await this.customerRepository.save(data);
  }

  async remove(id: number): Promise<CustomerEntity> {
    const existingCustomer = await this.findOne(id);

    await this.customerRepository.softDelete(id);

    return existingCustomer;
  }
}
