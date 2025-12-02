import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderStatus, OrderType, PaymentMethod } from '../entities/order.entity';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  constructor() {
    this.userId = '';
    this.items = [];
    this.orderType = OrderType.DINE_IN; // Valeur par défaut
  }

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  tableNumber?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING_PAYMENT;
}