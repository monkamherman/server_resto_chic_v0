import { Dish } from "../entities/dish.entity";

export interface PrismaDishType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_available: boolean;
  average_rating: number | null;
  created_at: Date;
  updated_at: Date;
}

export function toDishDomain(prismaDish: PrismaDishType): Dish {
  return {
    id: prismaDish.id,
    name: prismaDish.name,
    description: prismaDish.description || undefined,
    price: prismaDish.price,
    category: prismaDish.category,
    imageUrl: prismaDish.imageUrl || undefined,
    isAvailable: prismaDish.is_available,
    isVegetarian: prismaDish.is_vegetarian,
    isVegan: prismaDish.is_vegan,
    isGlutenFree: prismaDish.is_gluten_free,
    averageRating: prismaDish.average_rating || undefined,
    createdAt: prismaDish.created_at,
    updatedAt: prismaDish.updated_at,
  };
}
