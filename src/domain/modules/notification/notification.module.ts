import { Module } from '@nestjs/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationController } from '../../../interfaces/controllers/notification/notification.controller';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
