import { Router } from 'express';
import { ReviewController } from '../domain/review/review.controller';
import { ReviewService } from '../domain/services/review.service';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { NotificationService } from '../domain/services/notification.service';

export function setupReviewRoutes(prismaService: PrismaService, notificationService: NotificationService): Router {
  const router = Router();
  const reviewService = new ReviewService(prismaService, notificationService);
  const reviewController = new ReviewController(reviewService);

  // Routes publiques
  router.get('/dishes/:dishId/reviews', (req, res) => 
    reviewController.getByDishId(req, res, req.params.dishId));

  // Routes protégées (authentification requise)
  router.post('/reviews', (req, res) => reviewController.create(req, res));
  router.put('/reviews/:id', (req, res) => 
    reviewController.update(req, res, req.params.id));
  router.delete('/reviews/:id', (req, res) => 
    reviewController.remove(req, res, req.params.id));

  // Routes d'administration (modération)
  router.put('/admin/reviews/:id/approve', (req, res) => 
    reviewController.approveReview(req, res, req.params.id));
  router.put('/admin/reviews/:id/reject', (req, res) => 
    reviewController.rejectReview(req, res, req.params.id));

  return router;
}
