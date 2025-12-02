import { IsOptional, IsDateString, IsUUID, IsNumber, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewFiltersDto {
  @ApiProperty({ required: false, description: 'Numéro de page', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Nombre d\'éléments par page', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'ID de l\'utilisateur' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false, description: 'ID du plat' })
  @IsOptional()
  @IsUUID()
  dishId?: string;

  @ApiProperty({ required: false, description: 'Note minimale (1-5)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiProperty({ required: false, description: 'Note maximale (1-5)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  maxRating?: number;

  @ApiProperty({ required: false, description: 'Date de début (format ISO)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'Date de fin (format ISO)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Statut de l\'avis',
    enum: ['pending', 'approved', 'rejected']
  })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Champ de tri',
    enum: ['created_at', 'rating', 'updated_at'],
    default: 'created_at'
  })
  @IsOptional()
  @IsIn(['created_at', 'rating', 'updated_at'])
  sortBy?: string = 'created_at';

  @ApiProperty({ 
    required: false, 
    description: 'Ordre de tri',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
