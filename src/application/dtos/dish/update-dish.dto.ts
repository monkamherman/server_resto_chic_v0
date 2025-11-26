import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDishDto extends PartialType(CreateDishDto) {
  @ApiProperty({
    description: 'Nom du plat',
    example: 'Poulet rôti aux herbes de Provence',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Prix du plat',
    example: 26.99,
    required: false
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Catégorie du plat',
    example: 'Spécialités',
    required: false
  })
  @IsString()
  @IsOptional()
  category?: string;
}
