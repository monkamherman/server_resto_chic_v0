import { CreateDishDto } from "@domain/dish/dtos/create-dish.dto";
import { UpdateDishDto } from "@domain/dish/dtos/update-dish.dto";
import { Dish, PrismaDish } from "@domain/dish/entities/dish.entity";
import { IDishRepository } from "@domain/dish/repositories/IDishRepository";
import { PrismaService } from "@infrastructure/persistence/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaDishRepository implements IDishRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(prismaDish: PrismaDish): Dish {
    return Dish.fromPrisma({
      ...prismaDish,
      // S'assurer que les champs optionnels sont correctement gérés
      description: prismaDish.description || null,
      imageUrl: prismaDish.imageUrl || null,
      average_rating: prismaDish.average_rating || null,
    });
  }

  async create(data: CreateDishDto): Promise<Dish> {
    const createdDish = await this.prisma.dish.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isVegetarian: data.isVegetarian || false,
        isVegan: data.isVegan || false,
        isGlutenFree: data.isGlutenFree || false,
        averageRating: data.averageRating || null,
      },
    });

    return this.toDomain(createdDish as unknown as PrismaDish);
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    });

    return dish ? this.toDomain(dish as unknown as PrismaDish) : null;
  }

  async findAll(): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany();
    return dishes.map((dish) => this.toDomain(dish as unknown as PrismaDish));
  }

  async update(id: string, data: UpdateDishDto): Promise<Dish | null> {
    interface UpdateDishData {
      name?: string;
      description?: string | null;
      price?: number;
      category?: string;
      imageUrl?: string | null;
      isAvailable?: boolean;
      isVegetarian?: boolean;
      isVegan?: boolean;
      isGlutenFree?: boolean;
      averageRating?: number | null;
    }

    const updateData: UpdateDishData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description || null;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageUrl !== undefined)
      updateData.imageUrl = data.imageUrl || null;
    if (data.isAvailable !== undefined)
      updateData.isAvailable = data.isAvailable;
    if (data.isVegetarian !== undefined)
      updateData.isVegetarian = data.isVegetarian;
    if (data.isVegan !== undefined) updateData.isVegan = data.isVegan;
    if (data.isGlutenFree !== undefined)
      updateData.isGlutenFree = data.isGlutenFree;
    if (data.averageRating !== undefined)
      updateData.averageRating = data.averageRating || null;

    try {
      const updatedDish = await this.prisma.dish.update({
        where: { id },
        data: updateData,
      });

      return this.toDomain(updatedDish as unknown as PrismaDish);
    } catch (error) {
      console.error("Error updating dish:", error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.dish.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting dish:", error);
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
      where: { category },
    });
    return dishes.map((dish) => this.toDomain(dish as unknown as PrismaDish));
  }
}
