import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
} from "class-validator";
import { UserRole } from "../../../../../domain/users/enums";

export class CreateUserDto {
  @ApiProperty({ description: "Nom complet de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({ description: "Adresse email" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "Numéro de téléphone" })
  @IsPhoneNumber("FR")
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ description: "Mot de passe (minimum 6 caractères)" })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole = UserRole.USER;
}
