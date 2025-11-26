import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email ou numéro de téléphone de l\'utilisateur',
    example: 'user@example.com ou +1234567890'
  })
  @IsNotEmpty()
  @IsString()
  identifier: string = '';

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'MonMotDePasse123!'
  })
  @IsNotEmpty()
  @IsString()
  password: string = '';
}
