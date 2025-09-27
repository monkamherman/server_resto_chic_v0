import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Numéro de téléphone ou email',
    example: '+33612345678 ou utilisateur@example.com'
  })
  @IsNotEmpty({ message: 'L\'identifiant est requis' })
  @IsString()
  identifier!: string;

  @ApiProperty({ 
    description: 'Code OTP',
    example: '123456',
    minLength: 4,
    maxLength: 6
  })
  @IsNotEmpty({ message: 'Le code OTP est requis' })
  @IsString()
  @Length(4, 6, { message: 'Le code OTP doit contenir entre 4 et 6 chiffres' })
  otpCode!: string;
}
