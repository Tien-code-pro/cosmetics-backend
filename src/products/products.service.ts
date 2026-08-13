import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto as any });
  }

  // Danh sách bình thường — chỉ hiện sản phẩm CHƯA bị xóa
  async findAll(query: FindProductsQueryDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // Danh sách thùng rác — chỉ hiện sản phẩm ĐÃ bị xóa mềm
  findTrash() {
    return this.prisma.product.findMany({
      where: { deletedAt: { not: null } },
      include: { category: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto as any,
    });
  }

  // Xóa mềm — chỉ set deletedAt, KHÔNG xóa thật khỏi database
  async softDelete(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Khôi phục từ thùng rác
  async restore(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!product)
      throw new NotFoundException(`Không tìm thấy sản phẩm trong thùng rác`);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  // Xóa vĩnh viễn — chỉ áp dụng cho sản phẩm ĐANG trong thùng rác
  async permanentDelete(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!product)
      throw new NotFoundException(
        `Sản phẩm phải ở trong thùng rác trước khi xóa vĩnh viễn`,
      );
    return this.prisma.product.delete({ where: { id } });
  }
}
