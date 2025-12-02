import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreateReservationDto {
  constructor() {
    this.reservationDate = "";
    this.partySize = 1; // Valeur par défaut
  }

  @IsNotEmpty()
  @IsDateString()
  reservationDate: string;

  @IsOptional()
  @IsDateString()
  reservationEnd?: string;

  @IsOptional()
  @IsNumber()
  @Min(30, { message: "La durée minimale est de 30 minutes" })
  duration: number = 120; // 2h par défaut

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: "Le nombre de personnes doit être d'au moins 1" })
  partySize: number;
}
