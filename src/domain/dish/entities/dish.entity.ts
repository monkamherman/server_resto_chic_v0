import { ApiProperty } from '@nestjs/swagger';

export class Dish {
  @ApiProperty({ description: 'The unique identifier of the dish' })
  id: string;

  @ApiProperty({ description: 'The name of the dish' })
  name: string;

  @ApiProperty({ description: 'The description of the dish', required: false })
  description?: string;

  @ApiProperty({ description: 'The price of the dish' })
  price: number;

  @ApiProperty({ description: 'Whether the dish is active', default: true })
  isActive: boolean = true;

  @ApiProperty({ description: 'The date when the dish was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the dish was last updated' })
  updatedAt: Date;
}
