// import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateDishDto {
  name!: string;
  description?: string;
  price!: number;
  category!: string;
  imageUrl?: string;
  isAvailable: boolean = true;
}
