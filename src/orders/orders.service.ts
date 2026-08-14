import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const orderNumber = `ORD-${Date.now()}`;

    // Nếu đơn hàng có customerId thì kiểm tra khách hàng
    if (dto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: {
          id: dto.customerId,
        },
      });

      if (!customer) {
        throw new NotFoundException('Không tìm thấy khách hàng');
      }

      if (!customer.isActive) {
        throw new ForbiddenException(
          'Tài khoản khách hàng đã bị khóa, không thể đặt hàng',
        );
      }
    }

    return this.prisma.order.create({
      data: {
        orderNumber,

        ...(dto.customerId && {
          customer: {
            connect: {
              id: dto.customerId,
            },
          },
        }),

        items: dto.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: dto.totalAmount,
        paymentMethod: dto.paymentMethod ?? 'COD',
        shippingAddress: dto.shippingAddress,
        note: dto.note,
      },
    });
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  }) {
    const { page, limit, search, status, paymentStatus, paymentMethod } =
      params;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (search) {
      where.OR = [
        {
          orderNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          customer: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          customer: {
            phone: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.order.count({
        where,
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [totalOrders, revenueResult, customers] = await Promise.all([
      // Tổng tất cả đơn hàng
      this.prisma.order.count(),

      // Tổng giá trị tất cả đơn hàng
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),

      // Danh sách customerId duy nhất đã từng đặt hàng
      this.prisma.order.findMany({
        where: {
          customerId: {
            not: null,
          },
        },
        select: {
          customerId: true,
        },
        distinct: ['customerId'],
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: Number(revenueResult._sum.totalAmount || 0),
      totalCustomers: customers.length,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);

    const allowedTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipping', 'cancelled'],
      shipping: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    const allowedNextStatuses = allowedTransitions[order.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      throw new BadRequestException(
        `Không thể chuyển đơn hàng từ "${order.status}" sang "${status}"`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    const order = await this.findOne(id);

    if (order.paymentStatus === 'paid' && paymentStatus === 'unpaid') {
      throw new BadRequestException(
        'Không thể chuyển trạng thái thanh toán từ "paid" về "unpaid"',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
      },
    });
  }

  // async update(id: string, dto: UpdateOrderDto) {
  //   await this.findOne(id);
  //   return this.prisma.order.update({ where: { id }, data: dto as any });
  // }

  // async remove(id: string) {
  //   await this.findOne(id);
  //   return this.prisma.order.delete({ where: { id } });
  // }
}
