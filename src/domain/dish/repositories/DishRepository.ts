import { PrismaService } from "@infrastructure/persistence/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateDishDto } from "../dtos/create-dish.dto";
import { UpdateDishDto } from "../dtos/update-dish.dto";
import { Dish } from "../entities/dish.entity";
import { IDishRepository } from "./IDishRepository";
import { PrismaDishType, toDishDomain } from "../types/prisma-dish.type";
import { UpdateDishInput } from "../types/update-dish-input.type";

@Injectable()
export class PrismaDishRepository implements IDishRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(prismaDish: PrismaDishType): Dish {
    return toDishDomain(prismaDish);
  }

  async create(data: CreateDishDto): Promise<Dish> {
    const createdDish = await this.prisma.dish.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl || null,
        isVegetarian: data.isVegetarian || false,
        isVegan: data.isVegan || false,
        isGlutenFree: data.isGlutenFree || false,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        averageRating: null,
      },
    }) as unknown as PrismaDishType;
    return this.toDomain(createdDish);
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    }) as unknown as PrismaDishType | null;
    return dish ? this.toDomain(dish) : null;
  }

  async findAll(): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      where: { isAvailable: true },
    }) as unknown as PrismaDishType[];
    return dishes.map((dish) => this.toDomain(dish));
  }

  async update(id: string, data: UpdateDishDto): Promise<Dish | null> {
    const updateData: UpdateDishInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = parseFloat(data.price.toString());
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl || null;
    }
if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
    if (data.isVegetarian !== undefined) updateData.isVegetarian = data.isVegetarian;
    if (data.isVegan !== undefined) updateData.isVegan = data.isVegan;
    if (data.isGlutenFree !== undefined) updateData.isGlutenFree = data.isGlutenFree;
    if (data.averageRating !== undefined) updateData.averageRating = data.averageRating;

    const updatedDish = await this.prisma.dish.update({
      where: { id },
      data: updateData,
    }) as unknown as PrismaDishType;

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
        isAvailable: true,
      },
    }) as unknown as PrismaDishType[];
    return dishes.map((dish) => this.toDomain(dish));
  }
}
