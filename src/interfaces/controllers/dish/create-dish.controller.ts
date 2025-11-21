import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DishService } from '../../../../domain/dish/services/dish.service';
import { CreateDishDto } from '../../../../domain/dish/dtos/create-dish.dto';
import { Dish } from '../../../../domain/dish/entities/dish.entity';

@ApiTags('dishes')
@Controller('dishes')
export class CreateDishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new dish' })
  @ApiResponse({ status: 201, description: 'The dish has been successfully created.', type: Dish })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Dish with this name already exists.' })
  async create(@Body() createDishDto: CreateDishDto): Promise<Dish> {
    return this.dishService.create(createDishDto);
  }
}
