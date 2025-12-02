import { IsNotEmpty, IsNumber, IsString, IsUUID, IsOptional } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  dishId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
