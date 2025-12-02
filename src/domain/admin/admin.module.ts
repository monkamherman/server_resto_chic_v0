import { Module } from '@nestjs/common';
import { ReviewAdminController } from './controllers/review-admin.controller';
import { ReviewService } from '../services/review.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { NotificationModule } from '../../infrastructure/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [ReviewAdminController],
  providers: [ReviewService],
  exports: [],
})
export class AdminModule {}
