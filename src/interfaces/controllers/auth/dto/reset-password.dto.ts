import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    description: "Token de réinitialisation",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsNotEmpty({ message: "Le token est requis" })
  @IsString()
  token!: string;

  @ApiProperty({
    description: "Nouveau mot de passe",
    minLength: 6,
    example: "NouveauMotDePasse123!",
  })
  @IsNotEmpty({ message: "Le nouveau mot de passe est requis" })
  @IsString()
  @MinLength(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  })
  newPassword!: string;

  @ApiProperty({
    description: "Confirmation du nouveau mot de passe",
    example: "NouveauMotDePasse123!",
  })
  @IsNotEmpty({ message: "La confirmation du mot de passe est requise" })
  @IsString()
  confirmNewPassword!: string;
}
