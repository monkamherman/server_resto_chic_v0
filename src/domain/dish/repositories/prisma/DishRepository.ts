import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import { IDishRepository } from '@domain/dish/repositories/IDishRepository';
import { Dish } from '@domain/dish/entities/dish.entity';
import { CreateDishDto } from '@domain/dish/dtos/create-dish.dto';
import { UpdateDishDto } from '@domain/dish/dtos/update-dish.dto';

@Injectable()
export class PrismaDishRepository implements IDishRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(prismaDish: {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    category: string;
    image_url: string | null;
    is_available: boolean;
    created_at: Date;
    updated_at: Date;
  }): Dish {
    return {
      id: prismaDish.id,
      name: prismaDish.name,
      description: prismaDish.description || undefined,
      price: typeof prismaDish.price === 'string' ? parseFloat(prismaDish.price) : prismaDish.price,
      category: prismaDish.category,
      imageUrl: prismaDish.image_url || undefined,
      isAvailable: prismaDish.is_available,
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
        image_url: data.imageUrl,
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
    const dishes = await this.prisma.dish.findMany();
    return dishes.map(dish => this.toDomain(dish));
  }

  async update(id: string, data: UpdateDishDto): Promise<Dish | null> {
    interface UpdateData {
      name?: string;
      description?: string | null;
      price?: number;
      category?: string;
      image_url?: string | null;
      is_available?: boolean;
    }
    
    const updateData: UpdateData = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = parseFloat(data.price.toString());
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
    if (data.isAvailable !== undefined) updateData.is_available = data.isAvailable;
    
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
      where: { category },
    });
    return dishes.map(dish => this.toDomain(dish));
  }
}
