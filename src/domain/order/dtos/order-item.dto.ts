import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class OrderItemDto {
  constructor() {
    this.dishId = "";
    this.name = "";
    this.quantity = 1; // Valeur par défaut
    this.unitPrice = 0; // Valeur par défaut
  }

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
