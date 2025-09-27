import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Vérifier l\'état de l\'API' })
  @ApiResponse({ status: 200, description: 'API opérationnelle' })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
