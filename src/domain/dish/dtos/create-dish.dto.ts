import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean = true;

  @IsBoolean()
  @IsOptional()
  isVegetarian: boolean = false;

  @IsBoolean()
  @IsOptional()
  isVegan: boolean = false;

  @IsBoolean()
  @IsOptional()
  isGlutenFree: boolean = false;

  @IsNumber()
  @IsOptional()
  averageRating?: number;
}
