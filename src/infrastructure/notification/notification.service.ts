import { Injectable } from '@nestjs/common';
import { NotificationType } from '../../domain/enums/notification-type.enum';

interface NotificationData {
  [key: string]: string | number | boolean | Date | null | undefined;
}

@Injectable()
export class NotificationService {
  async notifyUser(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: NotificationData,
  ) {
    // Implémentez ici la logique d'envoi de notification
    // Par exemple, en utilisant un service d'emails, de notifications push, etc.
    console.log(`Notification [${type}] to user ${userId}: ${title} - ${message}`, data);
    return { success: true };
  }

  async notifyNewReview(reviewId: string, dishName: string) {
    // Implémentez ici la logique de notification pour les nouveaux avis
    console.log(`Nouvel avis à modérer: ${reviewId} pour le plat ${dishName}`);
    return { success: true };
  }
}
