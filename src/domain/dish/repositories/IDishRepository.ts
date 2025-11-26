import { Dish } from '../entities/dish.entity';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { UpdateDishDto } from '../dtos/update-dish.dto';

export const IDishRepository = Symbol('IDishRepository');

export interface IDishRepository {
  // Create a new dish
  create(data: CreateDishDto): Promise<Dish>;
  
  // Find a dish by ID
  findById(id: string): Promise<Dish | null>;
  
  // Find all dishes
  findAll(): Promise<Dish[]>;
  
  // Update a dish
  update(id: string, data: UpdateDishDto): Promise<Dish | null>;
  
  // Delete a dish
  delete(id: string): Promise<boolean>;
  
  // Find dishes by category
  findByCategory(category: string): Promise<Dish[]>;
  
  // Check if a dish with the given name exists
  exists(name: string): Promise<boolean>;
}
