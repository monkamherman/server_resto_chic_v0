import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDishDto {
  @ApiProperty({
    description: 'Nom du plat',
    example: 'Poulet rôti aux herbes',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty({
    description: 'Description détaillée du plat',
    example: 'Poulet rôti lentement avec un mélange d\'herbes de Provence',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Prix du plat',
    example: 24.99,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  price: number = 0;

  @ApiProperty({
    description: 'URL de l\'image du plat',
    example: 'https://example.com/images/poulet-roti.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'Catégorie du plat',
    example: 'Plats principaux',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  category: string = '';

  @ApiProperty({
    description: 'Indique si le plat est en vedette',
    example: true,
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean = false;

  @ApiProperty({
    description: 'Indique si le plat est disponible à la commande',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean = true;
}
