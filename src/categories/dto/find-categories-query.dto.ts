import { IsOptional, IsString, IsIn } from 'class-validator';

export class FindCategoriesQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn(['active', 'inactive']) status?: string;
}
