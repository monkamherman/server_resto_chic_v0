import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedEntity?: string,
  ) {
    return this.prisma.notification.create({
      data: {
        user_id: userId,
        type,
        title,
        message,
        related_entity: relatedEntity,
      },
    });
  }

  async notifyNewReview(reviewId: string, dishName: string) {
    // Notifier l'administrateur
    await this.notifyAdmins(
      'Nouvel avis à modérer',
      `Un nouvel avis a été posté pour le plat "${dishName}"`,
      `review:${reviewId}`
    );

    // Ici, tu peux ajouter d'autres notifications, par exemple :
    // - Notifier le propriétaire du restaurant
    // - Notifier les utilisateurs qui suivent ce plat
  }

  private async notifyAdmins(title: string, message: string, relatedEntity?: string) {
    const admins = await this.prisma.userRole.findMany({
      where: { role: 'ADMIN' },
      select: { user_id: true },
    });

    await Promise.all(
      admins.map(admin =>
        this.createNotification(
          admin.user_id,
          NotificationType.REVIEW_NEEDS_MODERATION,
          title,
          message,
          relatedEntity,
        ),
      ),
    );
  }

  async getUserNotifications(userId: string, options: { limit: number; unreadOnly?: boolean }) {
    const { limit, unreadOnly } = options;
    
    return this.prisma.notification.findMany({
      where: { 
        user_id: userId,
        ...(unreadOnly ? { is_read: false } : {})
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, user_id: userId },
      data: { is_read: true, read_at: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { 
        user_id: userId,
        is_read: false
      },
      data: { 
        is_read: true, 
        read_at: new Date() 
      },
    });
  }
}
