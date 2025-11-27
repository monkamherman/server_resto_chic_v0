import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TableLocation } from '../entities/table.entity';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  reservationDate: string;

  @IsOptional()
  @IsDateString()
  reservationEnd?: string;

  @IsOptional()
  @IsNumber()
  @Min(30, { message: 'La durée minimale est de 30 minutes' })
  duration?: number = 120; // 2h par défaut

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Le nombre de personnes doit être d\'au moins 1' })
  partySize: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  locationPreference?: TableLocation;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;
}
