import { UserRole } from "@domain/users/enums/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "ID unique de l'utilisateur" })
  id!: string;

  @ApiProperty({ description: "Nom complet de l'utilisateur" })
  fullName!: string;

  @ApiProperty({ description: "Nom de famille", required: false })
  nom?: string;

  @ApiProperty({ description: "Prénom", required: false })
  prenom?: string;

  @ApiProperty({ description: "Genre", required: false })
  sexe?: string;

  @ApiProperty({ description: "Numéro de téléphone" })
  phoneNumber!: string;

  @ApiProperty({ description: "Adresse email", required: false })
  email?: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @ApiProperty({ description: "Statut actif de l'utilisateur" })
  isActive!: boolean;

  @ApiProperty({ description: "Date de création" })
  createdAt!: Date;

  @ApiProperty({ description: "Date de dernière mise à jour" })
  updatedAt!: Date;

  // On exclut le mot de passe et les informations sensibles
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
