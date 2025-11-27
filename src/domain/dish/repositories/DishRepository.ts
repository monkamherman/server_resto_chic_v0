import { PrismaService } from "@infrastructure/persistence/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateDishDto } from "../dtos/create-dish.dto";
import { UpdateDishDto } from "../dtos/update-dish.dto";
import { Dish } from "../entities/dish.entity";
import { IDishRepository } from "./IDishRepository";

@Injectable()
export class PrismaDishRepository implements IDishRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(prismaDish: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    category: string;
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_gluten_free: boolean;
    is_available: boolean;
    average_rating: number | null;
    created_at: Date;
    updated_at: Date;
  }): Dish {
    return {
      id: prismaDish.id,
      name: prismaDish.name,
      description: prismaDish.description || undefined,
      price:
        typeof prismaDish.price === "string"
          ? parseFloat(prismaDish.price)
          : prismaDish.price,
      category: prismaDish.category,
      imageUrl: prismaDish.images?.[0] || undefined,
      isAvailable: prismaDish.is_available,
      isVegetarian: prismaDish.is_vegetarian,
      isVegan: prismaDish.is_vegan,
      isGlutenFree: prismaDish.is_gluten_free,
      averageRating: prismaDish.average_rating || undefined,
      createdAt: prismaDish.created_at,
      updatedAt: prismaDish.updated_at,
    };
  }

  async create(data: CreateDishDto): Promise<Dish> {
    const createdDish = await this.prisma.dish.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
images: data.imageUrl ? [data.imageUrl] : [],
        is_available: data.isAvailable,
      },
    });
    return this.toDomain(createdDish);
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    });
    return dish ? this.toDomain(dish) : null;
  }

  async findAll(): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      where: { is_available: true },
    });
    return dishes.map((dish) => this.toDomain(dish));
  }

  async update(id: string, data: UpdateDishDto): Promise<Dish | null> {
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      category?: string;
      image_url?: string | null;
      is_available?: boolean;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined)
      updateData.price = parseFloat(data.price.toString());
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
    if (data.isAvailable !== undefined)
      updateData.is_available = data.isAvailable;

    const updatedDish = await this.prisma.dish.update({
      where: { id },
      data: updateData,
    });

    return updatedDish ? this.toDomain(updatedDish) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.dish.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(name: string): Promise<boolean> {
    const count = await this.prisma.dish.count({
      where: { name },
    });
    return count > 0;
  }

  async findByCategory(category: string): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      where: {
        category,
        is_available: true,
      },
    });
    return dishes.map((dish) => this.toDomain(dish));
  }
}
