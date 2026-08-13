import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto ';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsInt()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsIn(['COD', 'VNPay', 'Momo'])
  paymentMethod?: string;

  @IsObject()
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };

  @IsOptional()
  @IsString()
  note?: string;
}
