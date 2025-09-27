import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "Email ou numéro de téléphone de l'utilisateur",
    example: "utilisateur@example.com ou +1234567890",
  })
  @IsNotEmpty({ message: "L'email ou le numéro de téléphone est requis" })
  @IsString()
  identifier!: string;
}
