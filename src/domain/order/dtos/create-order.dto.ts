import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsNumber()
  @IsNotEmpty()
  total_amount!: number;

  @IsString()
  @IsOptional()
  coupon_code?: string;

  @IsNumber()
  @IsOptional()
  discount_amount?: number;

  @IsNumber()
  @IsNotEmpty()
  final_amount!: number;
}
