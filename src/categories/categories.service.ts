import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesQueryDto } from './dto/find-categories-query.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  async findAll(query: FindCategoriesQueryDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        include: { products: true },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  findTrash() {
    return this.prisma.category.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: { products: true },
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!category)
      throw new NotFoundException(`Không tìm thấy danh mục trong thùng rác`);
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async permanentDelete(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!category)
      throw new NotFoundException(
        `Danh mục phải ở trong thùng rác trước khi xóa vĩnh viễn`,
      );

    // Kiểm tra còn sản phẩm nào (kể cả đã xóa mềm) đang trỏ tới category này không
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        `Không thể xóa vĩnh viễn — vẫn còn ${productCount} sản phẩm thuộc danh mục này`,
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
