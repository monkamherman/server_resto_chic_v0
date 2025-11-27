import { Injectable } from '@nestjs/common';

type NotificationType = 'reservation_confirmation' | 'reservation_cancellation' | 'reservation_reminder';

@Injectable()
export class NotificationService {
  async sendNotification<T = unknown>(
    userId: string,
    type: NotificationType,
    data: T,
  ): Promise<void> {
    // Implémentation factice
    console.log(`Notification envoyée à l'utilisateur ${userId}`, { type, data });
  }
}
