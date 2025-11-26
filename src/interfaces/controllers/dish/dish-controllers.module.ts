import { Module } from '@nestjs/common';
import { DishModule } from '../../../domain/dish/dish.module';
import { DishController } from './dish.controller';
import { CreateDishController } from './create-dish.controller';
import { GetDishController } from './get-dish.controller';
import { UpdateDishController } from './update-dish.controller';
import { DeleteDishController } from './delete-dish.controller';

@Module({
  imports: [DishModule],
  controllers: [
    DishController,
    CreateDishController,
    GetDishController,
    UpdateDishController,
    DeleteDishController,
  ],
})
export class DishControllersModule {}
