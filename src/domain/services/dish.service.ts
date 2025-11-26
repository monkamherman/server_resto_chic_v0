import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import { CreateDishDto } from '@application/dtos/dish/create-dish.dto';
import { UpdateDishDto } from '@application/dtos/dish/update-dish.dto';
import { Dish } from '@prisma/client';

@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un nouveau plat
   */
  async create(createDishDto: CreateDishDto): Promise<Dish> {
    // Vérifier si un plat avec le même nom existe déjà
    const existingDish = await this.prisma.dish.findFirst({
      where: { name: createDishDto.name },
    });

    if (existingDish) {
      throw new ConflictException('Un plat avec ce nom existe déjà');
    }

    return this.prisma.dish.create({
      data: {
        ...createDishDto,
      },
    });
  }

  /**
   * Récupère tous les plats
   */
  async findAll(filters?: {
    category?: string;
    is_featured?: boolean;
    is_available?: boolean;
  }): Promise<Dish[]> {
    return this.prisma.dish.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
        ...(filters?.is_featured !== undefined && { is_featured: filters.is_featured }),
        ...(filters?.is_available !== undefined && { is_available: filters.is_available }),
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Récupère un plat par son ID
   */
  async findOne(id: string): Promise<Dish> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    });

    if (!dish) {
      throw new NotFoundException(`Plat avec l'ID "${id}" non trouvé`);
    }

    return dish;
  }

  /**
   * Met à jour un plat
   */
  async update(id: string, updateDishDto: UpdateDishDto): Promise<Dish> {
    await this.findOne(id); // Vérifie si le plat existe

    // Vérifier si un autre plat avec le même nom existe déjà
    if (updateDishDto.name) {
      const existingDish = await this.prisma.dish.findFirst({
        where: {
          name: updateDishDto.name,
          NOT: { id },
        },
      });

      if (existingDish) {
        throw new ConflictException('Un autre plat avec ce nom existe déjà');
      }
    }

    return this.prisma.dish.update({
      where: { id },
      data: updateDishDto,
    });
  }

  /**
   * Supprime un plat
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Vérifie si le plat existe

    await this.prisma.dish.delete({
      where: { id },
    });
  }

  /**
   * Récupère les catégories uniques de plats
   */
  async getCategories(): Promise<string[]> {
    const dishes = await this.prisma.dish.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return dishes.map((d) => d.category);
  }

  /**
   * Met à jour la disponibilité d'un plat
   */
  async updateAvailability(id: string, isAvailable: boolean): Promise<Dish> {
    return this.update(id, { is_available: isAvailable });
  }
}
