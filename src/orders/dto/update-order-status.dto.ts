import { IsIn, IsOptional } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'confirmed', 'shipping', 'completed', 'cancelled'])
  status: string;
}
