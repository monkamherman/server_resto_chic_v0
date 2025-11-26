import { ApiProperty } from '@nestjs/swagger';

export type FormateurStatut = 'DISPONIBLE' | 'OCCUPE' | 'INDISPONIBLE';

export class Formateur {
  @ApiProperty({ description: 'ID unique du formateur' })
  id: string;

  @ApiProperty({ description: 'Prénom du formateur', example: 'Jean' })
  prenom: string;

  @ApiProperty({ description: 'Nom du formateur', example: 'Dupont' })
  nom: string;

  @ApiProperty({ 
    description: 'Adresse email du formateur', 
    example: 'jean.dupont@example.com' 
  })
  email: string;

  @ApiProperty({ 
    description: 'Numéro de téléphone du formateur', 
    example: '+33123456789',
    required: false 
  })
  telephone?: string;

  @ApiProperty({ 
    description: 'Spécialités du formateur', 
    example: ['JavaScript', 'TypeScript', 'NestJS'],
    type: [String]
  })
  specialites: string[];

  @ApiProperty({ 
    description: 'Disponibilités du formateur',
    example: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
    type: [String]
  })
  disponibilites: string[];

  @ApiProperty({ 
    description: 'Statut du formateur', 
    example: 'DISPONIBLE',
    enum: ['DISPONIBLE', 'OCCUPE', 'INDISPONIBLE']
  })
  statut: FormateurStatut;

  @ApiProperty({ 
    description: 'Date de création du formateur',
    type: Date,
    required: false
  })
  createdAt?: Date;

  @ApiProperty({ 
    description: 'Date de dernière mise à jour',
    type: Date,
    required: false
  })
  updatedAt?: Date;

  constructor(partial: Partial<Formateur> = {}) {
    this.id = partial.id || '';
    this.prenom = partial.prenom || '';
    this.nom = partial.nom || '';
    this.email = partial.email || '';
    this.telephone = partial.telephone || '';
    this.specialites = partial.specialites || [];
    this.disponibilites = partial.disponibilites || [];
    this.statut = partial.statut || 'DISPONIBLE';
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
