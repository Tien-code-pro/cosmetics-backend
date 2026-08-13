import { IsIn } from 'class-validator';

export class UpdateOrderPaymentStatusDto {
  @IsIn(['unpaid', 'paid'])
  paymentStatus: string;
}
