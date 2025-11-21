import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IDishRepository } from '../repositories/IDishRepository';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { UpdateDishDto } from '../dtos/update-dish.dto';
import { Dish } from '../entities/dish.entity';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: IDishRepository) {}

  async create(createDishDto: CreateDishDto): Promise<Dish> {
    // Vérifier si un plat avec le même nom existe déjà
    const dishExists = await this.dishRepository.exists(createDishDto.name);
    if (dishExists) {
      throw new ConflictException('Un plat avec ce nom existe déjà');
    }

    return this.dishRepository.create(createDishDto);
  }

  async findAll(): Promise<Dish[]> {
    return this.dishRepository.findAll();
  }

  async findOne(id: string): Promise<Dish> {
    const dish = await this.dishRepository.findById(id);
    if (!dish) {
      throw new NotFoundException(`Plat avec l'ID "${id}" non trouvé`);
    }
    return dish;
  }

  async update(id: string, updateDishDto: UpdateDishDto): Promise<Dish> {
    // Vérifier si le plat existe et le récupérer
    const existingDish = await this.findOne(id);
    
    // Si le nom est fourni et différent du nom actuel, vérifier qu'il n'est pas déjà utilisé
    if (updateDishDto.name && existingDish.name !== updateDishDto.name) {
      const nameExists = await this.dishRepository.exists(updateDishDto.name);
      if (nameExists) {
        throw new ConflictException('Un plat avec ce nom existe déjà');
      }
    }

    const updatedDish = await this.dishRepository.update(id, updateDishDto);
    if (!updatedDish) {
      throw new NotFoundException(`Impossible de mettre à jour le plat avec l'ID "${id}"`);
    }
    return updatedDish;
  }

  async remove(id: string): Promise<void> {
    // Vérifier si le plat existe
    await this.findOne(id);
    
    const deleted = await this.dishRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Impossible de supprimer le plat avec l'ID "${id}"`);
    }
  }
}
