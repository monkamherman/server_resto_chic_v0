import { Module } from '@nestjs/common';
import { ReviewService } from '../../services/review.service';
import { ReviewController } from '../../review/review.controller';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../../../interfaces/controllers/auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    NotificationModule,
    AuthModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
