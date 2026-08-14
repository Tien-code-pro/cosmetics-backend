import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FindCustomersQueryDto } from './dto/find-customers-query.dto';
import { handlePrismaUniqueError } from 'src/common/utils/prisma-error.util';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(dto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (existingCustomer) {
      throw new ConflictException('Số điện thoại đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const customer = await this.prisma.customer.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return customer;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Số điện thoại đã tồn tại');
        }
      }

      throw error;
    }
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(query: FindCustomersQueryDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));

    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));

    const skip = (page - 1) * limit;

    const where: any = {};

    // SEARCH
    if (query.search?.trim()) {
      const search = query.search.trim();

      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // STATUS FILTER
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.customer.count({
        where,
      }),
    ]);

    return {
      data: data.map((customer) => this.excludePassword(customer)),

      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    return this.excludePassword(customer);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(id: string, dto: UpdateCustomerDto) {
    if (dto.phone) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: {
          phone: dto.phone,
        },
      });

      if (existingCustomer && existingCustomer.id !== id) {
        throw new ConflictException('Số điện thoại đã tồn tại');
      }
    }

    try {
      const customer = await this.prisma.customer.update({
        where: {
          id,
        },
        data: dto,
      });

      return customer;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Số điện thoại đã tồn tại');
        }
      }

      throw error;
    }
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateStatus(id: string, isActive: boolean) {
    await this.findOne(id);

    const customer = await this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

    return this.excludePassword(customer);
  }

  // =========================================================
  // STATS
  // =========================================================

  async getStats() {
    const [total, active] = await this.prisma.$transaction([
      this.prisma.customer.count(),

      this.prisma.customer.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    return {
      total,
      active,
      locked: total - active,
    };
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }

  // =========================================================
  // HANDLE PRISMA ERROR
  // =========================================================

  private handlePrismaError(error: any): never {
    // Prisma unique constraint
    if (error?.code === 'P2002') {
      const target = error?.meta?.target;

      if (Array.isArray(target) && target.includes('email')) {
        throw new ConflictException('Email đã tồn tại');
      }

      if (Array.isArray(target) && target.includes('phone')) {
        throw new ConflictException('Số điện thoại đã tồn tại');
      }

      throw new ConflictException('Thông tin khách hàng đã tồn tại');
    }

    // Không phải lỗi mà chúng ta xử lý
    throw error;
  }

  // =========================================================
  // REMOVE PASSWORD
  // =========================================================

  private excludePassword(customer: any) {
    const { password, ...rest } = customer;

    return rest;
  }
}
