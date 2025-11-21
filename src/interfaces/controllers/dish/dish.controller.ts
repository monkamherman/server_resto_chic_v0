import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dishes')
@Controller('dishes')
export class DishController {
  // Ce contrôleur sert principalement à regrouper les routes sous le préfixe 'dishes'
  // et à fournir une documentation Swagger commune
}
