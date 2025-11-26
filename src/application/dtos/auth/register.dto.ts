import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Numéro de téléphone de l\'utilisateur',
    example: '+1234567890'
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string = '';

  @ApiPropertyOptional({
    description: 'Email de l\'utilisateur',
    example: 'user@example.com'
  })
  @IsOptional()
  @IsEmail()
  email: string = '';

  @ApiProperty({
    description: 'Mot de passe (minimum 8 caractères)',
    minLength: 8,
    example: 'MonMotDePasse123!'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string = '';

  @ApiProperty({
    description: 'Nom complet de l\'utilisateur',
    example: 'Jean Dupont'
  })
  @IsNotEmpty()
  @IsString()
  fullName: string = '';

  @ApiPropertyOptional({
    description: 'Nom de famille',
    example: 'Dupont'
  })
  @IsOptional()
  @IsString()
  nom: string = '';

  @ApiPropertyOptional({
    description: 'Prénom',
    example: 'Jean'
  })
  @IsOptional()
  @IsString()
  prenom: string = '';

  @ApiPropertyOptional({
    description: 'Genre',
    enum: ['M', 'F', 'Autre'],
    example: 'M'
  })
  @IsOptional()
  @IsString()
  sexe: string = '';
}
