import { IsOptional, IsString, IsIn } from 'class-validator';

export class FindProductsQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsIn(['active', 'inactive']) status?: string;
}
