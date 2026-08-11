import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = await this.prisma.adminUser.create({
      data: { ...dto, password: hashedPassword },
    });
    return this.exclude(admin);
  }

  async findAll() {
    const admins = await this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return admins.map((a) => this.exclude(a));
  }

  async update(id: string, dto: UpdateAdminDto) {
    await this.ensureExists(id);
    if (dto.isActive === false) await this.ensureNotLastAdmin(id);
    const admin = await this.prisma.adminUser.update({
      where: { id },
      data: dto,
    });
    return this.exclude(admin);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.ensureNotLastAdmin(id);
    return this.prisma.adminUser.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Không tìm thấy tài khoản');
    return admin;
  }

  private async ensureNotLastAdmin(id: string) {
    const target = await this.prisma.adminUser.findUnique({ where: { id } });
    if (target?.role !== 'ADMIN') return;
    const activeAdminCount = await this.prisma.adminUser.count({
      where: { role: 'ADMIN', isActive: true },
    });
    if (activeAdminCount <= 1)
      throw new BadRequestException('Không thể khóa/xóa ADMIN cuối cùng');
  }

  private exclude(admin: any) {
    const { password, ...rest } = admin;
    return rest;
  }
}
