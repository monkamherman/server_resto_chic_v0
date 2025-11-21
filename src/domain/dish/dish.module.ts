import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/persistence/prisma/prisma.module';
import { DishService } from './services/dish.service';
import { DishRepository } from './repositories/DishRepository';
import { IDishRepository } from './repositories/IDishRepository';

@Module({
  imports: [PrismaModule],
  providers: [
    DishService,
    {
      provide: IDishRepository,
      useClass: DishRepository,
    },
  ],
  exports: [DishService],
})
export class DishModule {}
