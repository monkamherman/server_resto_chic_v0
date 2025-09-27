import { PartialType } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // On peut ajouter des champs spécifiques à la mise à jour si nécessaire
  // Par exemple, le statut actif ou d'autres champs qui ne sont pas dans la création

  @ApiProperty({
    description: "Statut actif de l'utilisateur",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
