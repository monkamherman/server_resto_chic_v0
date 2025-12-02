import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, OrderType, PaymentMethod } from '../entities/order.entity';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
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

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.DRAFT;

  @IsEnum(OrderType)
  @IsNotEmpty()
  orderType: OrderType;

  @IsObject()
  @IsOptional()
  payment?: {
    method: PaymentMethod;
    amountPaid: number;
    isPaid: boolean;
    tipAmount?: number;
    changeDue?: number;
  };

  @IsObject()
  @IsOptional()
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    instructions?: string;
  };

  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  reservationId?: string;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsString()
  @IsOptional()
  groupName?: string;
  @IsOptional()
  discount_amount?: number;

  @IsNumber()
  @IsNotEmpty()
  final_amount!: number;
}
