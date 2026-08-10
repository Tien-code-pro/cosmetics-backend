import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'shipping', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsIn(['unpaid', 'paid'])
  paymentStatus?: string;
}
