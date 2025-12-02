import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../../application/dtos/review/create-review.dto';
import { UpdateReviewDto } from '../../application/dtos/review/update-review.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel avis' })
  @ApiResponse({ status: 201, description: 'Avis créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé' })
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    try {
      return await this.reviewService.createReview(req.user.id, createReviewDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('dish/:dishId')
  @ApiOperation({ summary: 'Récupérer les avis d\'un plat' })
  @ApiResponse({ status: 200, description: 'Liste des avis récupérée avec succès' })
  @ApiResponse({ status: 404, description: 'Aucun avis trouvé pour ce plat' })
  async getByDishId(@Param('dishId') dishId: string) {
    try {
      return await this.reviewService.getDishReviews(dishId);
    } catch (error) {
      throw new NotFoundException('Aucun avis trouvé pour ce plat');
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un avis' })
  @ApiResponse({ status: 200, description: 'Avis mis à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    try {
      // Vérifier que l'utilisateur est le propriétaire de l'avis
      const review = await this.reviewService.getReviewById(id);
      if (review.user_id !== req.user.id) {
        throw new ForbiddenException('Vous ne pouvez pas modifier cet avis');
      }
      
      return await this.reviewService.updateReview(id, updateReviewDto);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un avis' })
  @ApiResponse({ status: 200, description: 'Avis supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  async remove(@Request() req, @Param('id') id: string) {
    try {
      // Vérifier que l'utilisateur est le propriétaire de l'avis ou un administrateur
      const review = await this.reviewService.getReviewById(id);
      if (review.user_id !== req.user.id && req.user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Vous ne pouvez pas supprimer cet avis');
      }
      
      return await this.reviewService.deleteReview(id);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approuver un avis (Admin/Modérateur)' })
  @ApiResponse({ status: 200, description: 'Avis approuvé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  async approveReview(@Param('id') id: string) {
    try {
      return await this.reviewService.moderateReview(id, true);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejeter un avis (Admin/Modérateur)' })
  @ApiResponse({ status: 200, description: 'Avis rejeté avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })
  async rejectReview(@Param('id') id: string) {
    try {
      return await this.reviewService.moderateReview(id, false);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
