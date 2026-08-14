import { ConflictException } from '@nestjs/common';

export function handlePrismaUniqueError(error: any): never {
  if (error?.code === 'P2002') {
    const target = error?.meta?.target;

    const fields = Array.isArray(target) ? target : target ? [target] : [];

    if (fields.includes('email')) {
      throw new ConflictException('Email đã tồn tại');
    }

    if (fields.includes('phone')) {
      throw new ConflictException('Số điện thoại đã tồn tại');
    }

    throw new ConflictException('Thông tin đã tồn tại');
  }

  throw error;
}
