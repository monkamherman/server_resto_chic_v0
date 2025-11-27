import { Injectable } from '@nestjs/common';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { UpdateDishDto } from '../dtos/update-dish.dto';
import { Dish } from '../entities/dish.entity';
import { IDishRepository } from '../repositories/IDishRepository';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: IDishRepository) {}

  async create(createDishDto: CreateDishDto): Promise<Dish> {
    return this.dishRepository.create(createDishDto);
  }

  async findAll(): Promise<Dish[]> {
    return this.dishRepository.findAll();
  }

  async findOne(id: string): Promise<Dish | null> {
    return this.dishRepository.findById(id);
  }

  async update(id: string, updateDishDto: UpdateDishDto): Promise<Dish | null> {
    return this.dishRepository.update(id, updateDishDto);
  }

  async remove(id: string): Promise<boolean> {
    return this.dishRepository.delete(id);
  }

  // Méthodes spécifiques au métier
  async findAvailableDishes(): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll();
    return dishes.filter(dish => dish.isAvailable);
  }

  async findDishesByCategory(category: string): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll();
    return dishes.filter(dish => dish.category === category);
  }

  async findVegetarianDishes(): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll();
    return dishes.filter(dish => dish.isVegetarian);
  }

  async findVeganDishes(): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll();
    return dishes.filter(dish => dish.isVegan);
  }

  async findGlutenFreeDishes(): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll();
    return dishes.filter(dish => dish.isGlutenFree);
  }
}
