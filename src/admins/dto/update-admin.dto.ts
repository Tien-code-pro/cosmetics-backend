import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsIn(['ADMIN', 'STAFF']) role?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
