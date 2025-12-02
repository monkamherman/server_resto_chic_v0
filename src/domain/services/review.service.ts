import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReviewFiltersDto } from '../../application/dtos/review/review-filters.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateReviewDto } from '../../application/dtos/review/create-review.dto';
import { UpdateReviewDto } from '../../application/dtos/review/update-review.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification-type.enum';
import { CacheService } from '../../infrastructure/cache/cache.service';
import { Prisma } from '@prisma/client';

// Types pour les requêtes Prisma
type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true } };
    dish: { select: { id: true; name: true } };
  };
}>;

interface PaginatedReviews {
  data: ReviewWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ReviewService {
  private readonly CACHE_PREFIX = 'review:';
  private readonly CACHE_TTL = 60 * 15; // 15 minutes

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private cacheService: CacheService,
  ) {}

  async getFilteredReviews(filters: ReviewFiltersDto): Promise<PaginatedReviews> {
    const {
      userId,
      dishId,
      minRating,
      maxRating,
      startDate,
      endDate,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    // Vérifier que dishId est défini si nécessaire
    if (dishId === undefined) {
      throw new BadRequestException('dishId est requis');
    }

    const skip = (page - 1) * limit;
    const where: Prisma.ReviewWhereInput = {};
    const andConditions: Prisma.ReviewWhereInput[] = [];
    
    if (userId) andConditions.push({ userId: { equals: userId } });
    if (dishId) andConditions.push({ dishId: { equals: dishId } });
    
    // Filtre par note
    if (minRating !== undefined || maxRating !== undefined) {
      const ratingConditions: { gte?: number; lte?: number } = {};
      if (minRating !== undefined) ratingConditions.gte = minRating;
      if (maxRating !== undefined) ratingConditions.lte = maxRating;
      andConditions.push({ rating: ratingConditions });
    }

    // Filtre par date
    if (startDate || endDate) {
      const dateConditions: { gte?: Date; lte?: Date } = {};
      if (startDate) dateConditions.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateConditions.lte = end;
      }
      andConditions.push({ createdAt: dateConditions });
    }

    // Filtre par statut
    if (status === 'pending') {
      andConditions.push({ isApproved: false });
    } else if (status === 'approved') {
      andConditions.push({ isApproved: true });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          dish: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async updateDishAverageRating(dishId: string): Promise<void> {
    // Récupérer les statistiques des avis
    await this.prisma.review.aggregate({
      where: { 
        dishId,
        isApproved: true 
      },
      _avg: { rating: true },
      _count: { id: true }
    });

    // La mise à jour de la note moyenne du plat est désactivée pour le moment
    // car elle nécessite un champ averageRating dans le modèle Dish
    // await this.prisma.dish.update({
    //   where: { id: dishId },
    //   data: {
    //     averageRating: stats._avg.rating || 0,
    //   }
    // });
  }

  private async invalidateReviewCaches(reviewId: string, dishId: string): Promise<void> {
    const cacheKeys = [
      `${this.CACHE_PREFIX}dish:${dishId}:stats`,
      `${this.CACHE_PREFIX}stats:global`
    ];
    
    await this.cacheService.deleteMultiple(cacheKeys);
  }

  async createReview(userId: string, createReviewDto: CreateReviewDto) {
    // Vérifier si le plat existe
    const dish = await this.prisma.dish.findUnique({
      where: { id: createReviewDto.dishId },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${createReviewDto.dishId} not found`);
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce plat
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        dishId: createReviewDto.dishId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('Vous avez déjà laissé un avis pour ce plat');
    }

    // Créer l'avis avec les données fournies
    const review = await this.prisma.review.create({
      data: {
        userId,
        dishId: createReviewDto.dishId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        isApproved: false, // Nécessite une modération
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Envoyer une notification pour la modération
    await this.notificationService.notifyNewReview(review.id, dish.name);

    return review;
  }

  async getReviewById(id: string): Promise<ReviewWithRelations> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    // Convertir le type pour correspondre à ReviewWithRelations
    const reviewWithRelations: ReviewWithRelations = {
      ...review,
      user: review.user || { id: '', name: null, email: null },
      dish: review.dish || { id: '', name: '' },
    };

    return reviewWithRelations;
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewWithRelations> {
    // Vérifier que l'avis existe avant de le mettre à jour
    await this.getReviewById(id);
    
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: {
        rating: updateReviewDto.rating,
        comment: updateReviewDto.comment,
        isApproved: false, // Remettre en attente de modération après modification
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Convertir le type pour correspondre à ReviewWithRelations
    const reviewWithRelations: ReviewWithRelations = {
      ...updatedReview,
      user: updatedReview.user || { id: '', name: null, email: null },
      dish: updatedReview.dish || { id: '', name: '' },
    };

    return reviewWithRelations;
  }

  async deleteReview(id: string) {
    const review = await this.getReviewById(id);
    
    await this.prisma.review.delete({
      where: { id },
    });

    // Mettre à jour la note moyenne du plat
    await this.updateDishAverageRating(review.dishId);
  }

  async moderateReview(id: string, isApproved: boolean, adminResponse?: string): Promise<ReviewWithRelations> {
    // Récupérer l'avis avec les relations nécessaires
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        dish: { select: { id: true, name: true } }
      }
    });

    if (!review) {
      throw new NotFoundException(`Avis avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour l'avis
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: {
        isApproved: isApproved,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Convertir le type pour correspondre à ReviewWithRelations
    const reviewWithRelations: ReviewWithRelations = {
      ...updatedReview,
      user: updatedReview.user || { id: '', name: null, email: null },
      dish: updatedReview.dish || { id: '', name: '' },
    };

    // Vérifier si le plat existe, a un nom et que l'utilisateur est défini
    if (review.dish && review.dish.name && review.user) {
      await this.notificationService.createNotification(
        review.userId,
        isApproved ? NotificationType.REVIEW_APPROVED : NotificationType.REVIEW_REJECTED,
        isApproved ? 'Votre avis a été approuvé' : 'Votre avis a été rejeté',
        isApproved 
          ? `Votre avis pour "${review.dish.name}" a été approuvé.`
          : `Votre avis pour "${review.dish.name}" a été rejeté.` + 
            (adminResponse ? `\nRaison : ${adminResponse}` : ''),
        `review:${id}`
      );
    }

    // Si l'avis est approuvé et qu'il y a un plat associé, mettre à jour la note moyenne
    if (isApproved && review.dishId) {
      await this.updateDishAverageRating(review.dishId);
    }

    // Invalider les caches liés à cet avis
    await this.invalidateReviewCaches(id, review.dishId);

    return reviewWithRelations;
  }

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { dish: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
