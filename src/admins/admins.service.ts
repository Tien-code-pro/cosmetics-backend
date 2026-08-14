import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

import { AdminRole } from 'generated/prisma/enums';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================

  async create(dto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await this.prisma.adminUser.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    return this.exclude(admin);
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll() {
    const admins = await this.prisma.adminUser.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return admins.map((admin) => this.exclude(admin));
  }

  // =========================
  // UPDATE
  // =========================

  async update(id: string, dto: UpdateAdminDto) {
    const currentAdmin = await this.ensureExists(id);

    const nextRole = dto.role ?? currentAdmin.role;
    const nextIsActive = dto.isActive ?? currentAdmin.isActive;

    // Nếu ADMIN này sau khi update vẫn là ADMIN + ACTIVE
    // thì không cần kiểm tra.
    //
    // Chỉ cần kiểm tra khi ADMIN hiện tại sẽ không còn là
    // ADMIN ACTIVE nữa.
    const willStopBeingActiveAdmin =
      currentAdmin.role === AdminRole.ADMIN &&
      currentAdmin.isActive === true &&
      (nextRole !== AdminRole.ADMIN || nextIsActive === false);

    if (willStopBeingActiveAdmin) {
      await this.ensureNotLastAdmin(id);
    }

    const admin = await this.prisma.adminUser.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return this.exclude(admin);
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: string) {
    await this.ensureExists(id);

    await this.ensureNotLastAdmin(id);

    const admin = await this.prisma.adminUser.delete({
      where: {
        id,
      },
    });

    return this.exclude(admin);
  }

  // =========================
  // CHECK EXISTS
  // =========================

  private async ensureExists(id: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    return admin;
  }

  // =========================
  // CHECK LAST ADMIN
  // =========================

  private async ensureNotLastAdmin(id: string) {
    const target = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!target) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    if (target.role !== AdminRole.ADMIN || !target.isActive) {
      return;
    }

    const activeAdminCount = await this.prisma.adminUser.count({
      where: {
        role: AdminRole.ADMIN,
        isActive: true,
      },
    });

    if (activeAdminCount <= 1) {
      throw new BadRequestException('Không thể khóa/xóa ADMIN cuối cùng');
    }
  }

  // =========================
  // REMOVE PASSWORD
  // =========================

  private exclude(admin: any) {
    const { password, ...rest } = admin;

    return rest;
  }
}
