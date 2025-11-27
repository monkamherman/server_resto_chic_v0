import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateReviewDto } from '../../application/dtos/review/create-review.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async createReview(userId: string, createReviewDto: CreateReviewDto) {
    // Vérifier si le plat existe
    const dish = await this.prisma.dish.findUnique({
      where: { id: createReviewDto.dishId },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${createReviewDto.dishId} not found`);
    }

    // Créer l'avis
    const review = await this.prisma.review.create({
      data: {
        user_id: userId,
        dish_id: createReviewDto.dishId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        images: createReviewDto.images || [],
        is_approved: false, // Nécessite une modération
      },
    });

    // Mettre à jour la note moyenne du plat (seulement pour les avis approuvés)
    await this.updateDishAverageRating(createReviewDto.dishId);

    // Envoyer une notification pour la modération
    await this.notificationService.notifyNewReview(review.id, dish.name);

    return review;
  }

  private async updateDishAverageRating(dishId: string): Promise<void> {
    // Récupérer uniquement les notes non nulles
    // Récupérer toutes les revues approuvées pour ce plat
    const reviews = await this.prisma.review.findMany({
      where: { 
        dish_id: dishId, 
        is_approved: true,
        // Utiliser gte: 1 pour s'assurer que la note est un nombre valide (1-5)
        rating: { gte: 1, lte: 5 }
      },
      select: { rating: true }
    });

    // Extraire les notes et s'assurer qu'elles sont des nombres
    const validRatings = reviews
      .map(r => r.rating)
      .filter((rating): rating is number => typeof rating === 'number');

    if (validRatings.length === 0) {
      // Mettre à jour avec une valeur par défaut si aucune note valide
      await this.prisma.dish.update({
        where: { id: dishId },
        data: { average_rating: 0 }, // Utiliser 0 au lieu de null pour éviter les problèmes de typage
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = totalRating / reviews.length;

    await this.prisma.dish.update({
      where: { id: dishId },
      data: { 
        average_rating: parseFloat(averageRating.toFixed(1))
      },
    });
  }

  async moderateReview(reviewId: string, isApproved: boolean, adminResponse?: string) {
    // Récupérer d'abord l'avis avec les relations nécessaires
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { 
        dish: true, 
        user: true 
      },
    });

    if (!review) {
      throw new NotFoundException(`Avis avec l'ID ${reviewId} non trouvé`);
    }

    // Mettre à jour l'avis
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        is_approved: isApproved,
        ...(adminResponse ? { admin_response: adminResponse } : {}),
      },
      include: { dish: true, user: true },
    });

    // Vérifier si le plat existe, a un nom et que l'utilisateur est défini
    if (review.dish_id && review.user_id && review.dish?.name) {
      await this.notificationService.createNotification(
        review.user_id,
        isApproved ? NotificationType.REVIEW_APPROVED : NotificationType.REVIEW_REJECTED,
        isApproved ? 'Votre avis a été approuvé' : 'Votre avis a été rejeté',
        isApproved 
          ? `Votre avis pour "${review.dish.name}" a été approuvé.`
          : `Votre avis pour "${review.dish.name}" a été rejeté.` + 
            (adminResponse ? `\nRaison : ${adminResponse}` : ''),
        `review:${reviewId}`
      );
    }

    // Si l'avis est approuvé et qu'il y a un plat associé, mettre à jour la note moyenne
    if (isApproved && review.dish_id) {
      await this.updateDishAverageRating(review.dish_id);
    }

    return updatedReview;
  }

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { user_id: userId },
      include: { dish: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    });
  }
}
