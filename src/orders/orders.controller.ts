import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentStatusDto } from './dto/update-order-payment-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('paymentMethod') paymentMethod?: string,
  ) {
    return this.ordersService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
      status,
      paymentStatus,
      paymentMethod,
    });
  }

  @Get('stats')
  getStats() {
    return this.ordersService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Patch(':id/payment-status')
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderPaymentStatusDto,
  ) {
    return this.ordersService.updatePaymentStatus(id, dto.paymentStatus);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
  //   return this.ordersService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(id);
  // }
}
