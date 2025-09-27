import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email ou numéro de téléphone de l\'utilisateur',
    example: 'utilisateur@example.com ou +1234567890'
  })
  @IsNotEmpty({ message: 'L\'email ou le numéro de téléphone est requis' })
  @IsString()
  identifier!: string;

  @ApiProperty({ 
    description: 'Mot de passe de l\'utilisateur',
    minLength: 6,
    example: 'MotDePasse123!'
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password!: string;
}
