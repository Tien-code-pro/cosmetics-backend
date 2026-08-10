import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsArray()
  items: any[]; // [{ productId, name, price, quantity }]

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
