export class Dish {
  id?: string;
  name!: string;
  description?: string;
  price!: number;
  category!: string;
  imageUrl?: string;
  isAvailable: boolean = true;
  createdAt?: Date;
  updatedAt?: Date;
}
