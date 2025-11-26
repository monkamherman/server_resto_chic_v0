import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DishService } from '../../../domain/dish/services/dish.service';
import { Dish } from '../../../domain/dish/entities/dish.entity';

@ApiTags('dishes')
@Controller('dishes')
export class GetDishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all dishes' })
  @ApiResponse({ status: 200, description: 'Return all dishes.', type: [Dish] })
  async findAll(): Promise<Dish[]> {
    return this.dishService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a dish by ID' })
  @ApiParam({ name: 'id', description: 'Dish ID' })
  @ApiResponse({ status: 200, description: 'Return the dish.', type: Dish })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  async findOne(@Param('id') id: string): Promise<Dish> {
    return this.dishService.findOne(id);
  }
}
