import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import { NotificationModule } from '../../notification/notification.module';
import { NotificationService } from '../../notification/services/notification.service';

@Module({
  imports: [NotificationModule],
  controllers: [ReservationController],
  providers: [ReservationService, PrismaService, NotificationService],
  exports: [ReservationService],
})
export class ReservationModule {}
