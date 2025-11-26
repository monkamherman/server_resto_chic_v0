import { Controller, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DishService } from '../../../domain/dish/services/dish.service';

@ApiTags('dishes')
@Controller('dishes')
export class DeleteDishController {
  constructor(private readonly dishService: DishService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a dish' })
  @ApiParam({ name: 'id', description: 'Dish ID' })
  @ApiResponse({ status: 204, description: 'The dish has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.dishService.remove(id);
  }
}
