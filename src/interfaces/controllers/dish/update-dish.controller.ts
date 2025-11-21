import { Controller, Put, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DishService } from '../../../../domain/dish/services/dish.service';
import { UpdateDishDto } from '../../../../domain/dish/dtos/update-dish.dto';
import { Dish } from '../../../../domain/dish/entities/dish.entity';

@ApiTags('dishes')
@Controller('dishes')
export class UpdateDishController {
  constructor(private readonly dishService: DishService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a dish' })
  @ApiParam({ name: 'id', description: 'Dish ID' })
  @ApiResponse({ status: 200, description: 'The dish has been successfully updated.', type: Dish })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  @ApiResponse({ status: 409, description: 'Dish with this name already exists.' })
  async update(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
  ): Promise<Dish> {
    return this.dishService.update(id, updateDishDto);
  }
}
