import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import * as webpush from 'web-push';
import { webpushConfig, notificationTemplates } from 'src/config/webpush.config';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // Configuration de web-push avec les clés VAPID
    webpush.setVapidDetails(
      webpushConfig.subject,
      webpushConfig.publicKey,
      webpushConfig.privateKey,
    );
  }

  async subscribeUser(userId: string, subscription: any) {
    try {
      await this.prisma.pushSubscription.upsert({
        where: { endpoint: subscription.endpoint },
        update: {
          userId,
          keys: subscription.keys,
          updatedAt: new Date(),
        },
        create: {
          userId,
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
      });
      return true;
    } catch (error) {
      console.error('Error subscribing user:', error);
      return false;
    }
  }

  async sendNotification(userId: string, type: NotificationType, data: any = {}) {
    try {
      // Récupérer les abonnements de l'utilisateur
      const subscriptions = await this.prisma.pushSubscription.findMany({
        where: { userId },
      });

      if (!subscriptions.length) return false;

      const template = notificationTemplates[type];
      if (!template) {
        throw new Error(`No template found for notification type: ${type}`);
      }

      const notification = {
        title: typeof template.title === 'function' ? template.title(data) : template.title,
        body: typeof template.message === 'function' ? template.message(data) : template.message,
        ...(template.options || {}),
        data: {
          type,
          ...data,
          timestamp: Date.now(),
        },
      };

      // Envoyer la notification à tous les appareils enregistrés
      const results = await Promise.allSettled(
        subscriptions.map((sub) =>
          webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as any,
            },
            JSON.stringify(notification),
          ),
        ),
      );

      // Enregistrer la notification dans la base de données
      await this.prisma.notification.create({
        data: {
          userId,
          reservationId: data.reservationId,
          type,
          title: notification.title,
          message: notification.body,
          pushData: data,
          sentAt: new Date(),
        },
      });

      return results.every((r) => r.status === 'fulfilled');
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  async scheduleNotification(
    userId: string,
    type: NotificationType,
    scheduledFor: Date,
    data: any = {},
  ) {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          reservationId: data.reservationId,
          type,
          title: notificationTemplates[type]?.title || 'Notification',
          message: '',
          pushData: data,
          scheduledFor,
          isRead: false,
        },
      });
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  // Méthode pour envoyer les notifications planifiées
  async sendScheduledNotifications() {
    const now = new Date();
    const notifications = await this.prisma.notification.findMany({
      where: {
        scheduledFor: {
          lte: now,
        },
        sentAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    const results = [];
    for (const notification of notifications) {
      try {
        await this.sendNotification(
          notification.userId,
          notification.type as NotificationType,
          notification.pushData,
        );
        
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { sentAt: new Date() },
        });
        
        results.push({ id: notification.id, status: 'success' });
      } catch (error) {
        console.error(`Failed to send notification ${notification.id}:`, error);
        results.push({ id: notification.id, status: 'error', error: error.message });
      }
    }

    return results;
  }
}
