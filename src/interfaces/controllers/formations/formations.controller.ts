import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { FormationsService } from '../../domain/formations/services/formations.service';
import { CreateFormationDto } from '../../domain/formations/dtos/create-formation.dto';
import { UpdateFormationDto } from '../../domain/formations/dtos/update-formation.dto';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';

@Controller('formations')
@UseGuards(JwtAuthGuard)
export class FormationsController {
  constructor(private readonly formationsService: FormationsService) {}

  @Post()
  create(@Body() createFormationDto: CreateFormationDto) {
    return this.formationsService.create(createFormationDto);
  }

  @Get()
  findAll() {
    return this.formationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formationsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFormationDto: UpdateFormationDto) {
    return this.formationsService.update(id, updateFormationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formationsService.remove(id);
  }
}
