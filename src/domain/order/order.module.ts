import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from '../../interfaces/controllers/order/order.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { OrderRepository } from './repositories/OrderRepository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

// Créer un jeton d'injection symbolique
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useFactory: (prisma: PrismaService) => new OrderRepository(prisma),
      inject: [PrismaService],
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
