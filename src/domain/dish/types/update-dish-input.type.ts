import { Prisma } from '@prisma/client';

export type UpdateDishInput = Prisma.DishUpdateInput & {
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  averageRating?: number | null;
};
