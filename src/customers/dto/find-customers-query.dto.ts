import { IsOptional, IsString, IsIn } from 'class-validator';

export class FindCustomersQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn(['true', 'false']) isActive?: string;
}
