export class Dish {
  id?: string;
  name!: string;
  description?: string;
  price!: number;
  category!: string;
  imageUrl?: string;
  isAvailable: boolean = true;
  isVegetarian: boolean = false;
  isVegan: boolean = false;
  isGlutenFree: boolean = false;
  averageRating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
