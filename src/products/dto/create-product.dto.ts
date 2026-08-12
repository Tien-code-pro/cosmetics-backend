import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional() @IsArray() skinType?: string[];
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() ingredients?: string;
  @IsOptional() @IsString() usageInstructions?: string;
  @IsOptional() specifications?: Record<string, any>;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() origin?: string;
}
