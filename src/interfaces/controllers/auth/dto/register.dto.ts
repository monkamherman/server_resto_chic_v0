import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../../../../domain/users/enums/user-role.enum";

export class RegisterDto {
  @ApiProperty({
    description: "Nom complet de l'utilisateur",
    example: "Jean Dupont",
  })
  @IsNotEmpty({ message: "Le nom complet est requis" })
  @IsString()
  fullName!: string;

  @ApiProperty({
    description: "Numéro de téléphone",
    example: "+33612345678",
  })
  @IsNotEmpty({ message: "Le numéro de téléphone est requis" })
  @IsPhoneNumber('FR', { message: "Numéro de téléphone français invalide" })
  phoneNumber!: string;

  @ApiProperty({
    description: "Adresse email",
    example: "jean.dupont@example.com",
    required: false,
  })
  @IsEmail({}, { message: "Email invalide" })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: "Mot de passe",
    minLength: 6,
    example: "MotDePasse123!",
  })
  @IsNotEmpty({ message: "Le mot de passe est requis" })
  @IsString()
  @MinLength(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  })
  password!: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur",
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole, { message: "Rôle utilisateur invalide" })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: "Nom de famille",
    required: false,
  })
  @IsString()
  @IsOptional()
  nom?: string;

  @ApiProperty({
    description: "Prénom",
    required: false,
  })
  @IsString()
  @IsOptional()
  prenom?: string;

  @ApiProperty({
    description: "Genre",
    required: false,
  })
  @IsString()
  @IsOptional()
  sexe?: string;
}
