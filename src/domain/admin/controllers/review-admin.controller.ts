import { 
  Controller, 
  Get, 
  Put, 
  Query, 
  Param, 
  UseGuards, 
  ParseIntPipe, 
  DefaultValuePipe,
  BadRequestException,
  Delete,
  Body
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../enums/user-role.enum';
import { ReviewService } from '../../services/review.service';
import { ReviewFiltersDto } from '../../../application/dtos/review/review-filters.dto';

@ApiTags('Admin - Avis')
@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
@ApiBearerAuth()
export class ReviewAdminController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Lister les avis avec filtres avancés',
    description: 'Récupère les avis avec pagination et filtres avancés. ' +
      'Les filtres incluent: utilisateur, plat, note, dates, statut et tri.'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Numéro de page (défaut: 1)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Nombre d\'éléments par page (max: 100, défaut: 10)' 
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'Filtrer par ID utilisateur' 
  })
  @ApiQuery({ 
    name: 'dishId', 
    required: false, 
    description: 'Filtrer par ID de plat' 
  })
  @ApiQuery({ 
    name: 'minRating', 
    required: false, 
    type: Number, 
    description: 'Note minimale (1-5)' 
  })
  @ApiQuery({ 
    name: 'maxRating', 
    required: false, 
    type: Number, 
    description: 'Note maximale (1-5)' 
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    description: 'Date de début (format ISO)' 
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    description: 'Date de fin (format ISO)' 
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: ['pending', 'approved', 'rejected'],
    description: 'Filtrer par statut' 
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    enum: ['created_at', 'rating', 'updated_at'],
    description: 'Champ de tri',
    example: 'created_at'
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    enum: ['asc', 'desc'],
    description: 'Ordre de tri',
    example: 'desc'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des avis récupérée avec succès',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              user_id: { type: 'string' },
              dish_id: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              is_approved: { type: 'boolean' },
              is_rejected: { type: 'boolean' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' }
                }
              },
              dish: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Paramètres de requête invalides' 
  })
  async getFilteredReviews(
    @Query() filters: ReviewFiltersDto
  ) {
    try {
      // S'assurer que la limite ne dépasse pas 100
      if (filters.limit && filters.limit > 100) {
        filters.limit = 100;
      }
      
      return await this.reviewService.getFilteredReviews(filters);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erreur lors de la récupération des avis'
      );
    }
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approuver un avis' })
  @ApiResponse({ status: 200, description: 'Avis approuvé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de l\'approbation' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  async approveReview(@Param('id') id: string) {
    try {
      return await this.reviewService.moderateReview(id, true);
    } catch (error) {
      throw new BadRequestException(error.message || 'Erreur lors de l\'approbation de l\'avis');
    }
  }

  @Put(':id/reject')
  @ApiOperation({ 
    summary: 'Rejeter un avis',
    description: 'Rejette un avis avec une raison optionnelle qui sera visible par l\'utilisateur.'
  })
  @ApiResponse({ status: 200, description: 'Avis rejeté avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors du rejet' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Raison du rejet (optionnel)',
          example: 'Contenu inapproprié'
        }
      }
    },
    required: false
  })
  async rejectReview(
    @Param('id') id: string,
    @Body() body?: { reason?: string }
  ) {
    try {
      return await this.reviewService.moderateReview(id, false, body?.reason);
    } catch (error) {
      throw new BadRequestException(error.message || 'Erreur lors du rejet de l\'avis');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer définitivement un avis' })
  @ApiResponse({ status: 200, description: 'Avis supprimé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la suppression' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  async deleteReview(@Param('id') id: string) {
    try {
      return await this.reviewService.hardDeleteReview(id);
    } catch (error) {
      throw new BadRequestException(error.message || 'Erreur lors de la suppression de l\'avis');
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir des statistiques sur les avis' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès' })
  async getReviewStats() {
    try {
      return await this.reviewService.getReviewStatistics();
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des statistiques');
    }
  }
}
