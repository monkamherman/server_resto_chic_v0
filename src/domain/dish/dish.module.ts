import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/persistence/prisma/prisma.module';
import { DishService } from '../services/dish.service';

@Module({
  imports: [PrismaModule],
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}
