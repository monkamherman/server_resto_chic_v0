interface OrderItem {
  id: string;
  // Ajoutez d'autres propriétés nécessaires
}

interface Review {
  id: string;
  // Ajoutez d'autres propriétés nécessaires
}

export interface PrismaDish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  average_rating: number | null;
  created_at: Date;
  updated_at: Date;
  orderItems?: OrderItem[];
  reviews?: Review[];
}

export class Dish {
  id!: string;
  name!: string;
  description?: string;
  price!: number;
  category!: string;
  imageUrl?: string;
  isAvailable!: boolean;
  isVegetarian!: boolean;
  isVegan!: boolean;
  isGlutenFree!: boolean;
  averageRating?: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<Dish> = {}) {
    Object.assign(this, {
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      ...partial
    });
  }

  static fromPrisma(prismaDish: PrismaDish): Dish {
    return new Dish({
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
    });
  }
}
