import { Module } from '@nestjs/common';
import { ReviewService } from '../../services/review.service';
import { ReviewController } from '../../../interfaces/controllers/review/review.controller';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
