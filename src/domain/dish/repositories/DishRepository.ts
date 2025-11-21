import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { IDishRepository } from './IDishRepository';
import { Dish } from '../entities/dish.entity';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { UpdateDishDto } from '../dtos/update-dish.dto';

@Injectable()
export class DishRepository implements IDishRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDishDto): Promise<Dish> {
    return this.prisma.dish.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: string): Promise<Dish | null> {
    return this.prisma.dish.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Dish[]> {
    return this.prisma.dish.findMany({
      where: { isActive: true },
    });
  }

  async update(id: string, data: UpdateDishDto): Promise<Dish | null> {
    return this.prisma.dish.update({
      where: { id },
      data,
    });
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
}
