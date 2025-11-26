import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, IsIn } from 'class-validator';

const STATUTS = ['DISPONIBLE', 'OCCUPE', 'INDISPONIBLE'] as const;
type StatutFormateur = typeof STATUTS[number];

export class CreateFormateurDto {
  constructor(partial: Partial<CreateFormateurDto> = {}) {
    Object.assign(this, {
      prenom: '',
      nom: '',
      email: '',
      specialites: [],
      disponibilites: [],
      statut: 'DISPONIBLE',
      ...partial
    });
  }
  @ApiProperty({ description: 'Prénom du formateur', example: 'Jean' })
  @IsString()
  prenom!: string;

  @ApiProperty({ description: 'Nom du formateur', example: 'Dupont' })
  @IsString()
  nom!: string;

  @ApiProperty({ 
    description: 'Adresse email du formateur', 
    example: 'jean.dupont@example.com' 
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'Numéro de téléphone du formateur', 
    example: '+33123456789',
    required: false 
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({ 
    description: 'Spécialités du formateur', 
    example: ['JavaScript', 'TypeScript', 'NestJS'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  specialites!: string[];

  @ApiProperty({ 
    description: 'Disponibilités du formateur',
    example: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  disponibilites!: string[];

  @ApiProperty({ 
    description: 'Statut du formateur', 
    example: 'DISPONIBLE',
    enum: STATUTS
  })
  @IsString()
  @IsIn(STATUTS)
  statut!: StatutFormateur;

}
