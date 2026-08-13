import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../../../generated/prisma/client';
export class CreateCategoryDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsString() slug: string;
  @IsOptional() @IsEnum(Status) status?: Status;
}
