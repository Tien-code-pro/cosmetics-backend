import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { AdminRole } from 'generated/prisma/enums';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
