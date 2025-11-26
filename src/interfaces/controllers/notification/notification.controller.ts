import { Controller, Get, UseGuards, Req, Query, Patch, Param } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { NotificationService } from '../../../domain/services/notification.service';

declare module 'express' {
  interface User {
    id: string;
    email: string;
    role: UserRole;
    [key: string]: unknown;
  }
}

interface AuthenticatedRequest extends Request {
  user: Express.User & { userId: string };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit = '10',
    @Query('unreadOnly') unreadOnly = 'false'
  ) {
    return this.notificationService.getUserNotifications(
      req.user.userId,
      {
        limit: parseInt(limit, 10),
        unreadOnly: unreadOnly === 'true'
      }
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @Req() req: AuthenticatedRequest, 
    @Param('id') notificationId: string
  ) {
    return this.notificationService.markAsRead(notificationId, req.user.userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: AuthenticatedRequest) {
    // Implémentation de la marque de toutes les notifications comme lues
    await this.notificationService.markAllAsRead(req.user.userId);
    return { success: true, message: 'Toutes les notifications ont été marquées comme lues' };
  }
}
