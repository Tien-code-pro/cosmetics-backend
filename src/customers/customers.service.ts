import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const customer = await this.prisma.customer.create({
      data: { ...dto, password: hashedPassword },
    });
    return this.excludePassword(customer);
  }

  async findAll() {
    const customers = await this.prisma.customer.findMany();
    return customers.map((c) => this.excludePassword(c));
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);
    return this.excludePassword(customer);
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
    const customer = await this.prisma.customer.update({ where: { id }, data });
    return this.excludePassword(customer);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.delete({ where: { id } });
  }

  private excludePassword(customer: any) {
    const { password, ...rest } = customer;
    return rest;
  }
}
