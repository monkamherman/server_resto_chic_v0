import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DishService } from '@domain/services/dish.service';
import { CreateDishDto } from '@application/dtos/dish/create-dish.dto';
import { UpdateDishDto } from '@application/dtos/dish/update-dish.dto';
import { JwtAuthGuard } from '@infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/security/guards/roles.guard';
import { Roles } from '@infrastructure/security/decorators/roles.decorator';
import { UserRole } from '@domain/users/enums/user-role.enum';

@ApiTags('dishes')
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau plat' })
  @ApiResponse({ status: 201, description: 'Le plat a été créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 409, description: 'Un plat avec ce nom existe déjà.' })
  async create(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les plats' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrer par catégorie' })
  @ApiQuery({ name: 'is_featured', required: false, description: 'Filtrer les plats en vedette', type: Boolean })
  @ApiQuery({ name: 'is_available', required: false, description: 'Filtrer les plats disponibles', type: Boolean })
  @ApiResponse({ status: 200, description: 'Liste des plats récupérée avec succès.' })
  async findAll(
    @Query('category') category?: string,
    @Query('is_featured') isFeatured?: string,
    @Query('is_available') isAvailable?: string,
  ) {
    return this.dishService.findAll({
      category,
      is_featured: isFeatured ? isFeatured === 'true' : undefined,
      is_available: isAvailable ? isAvailable === 'true' : undefined,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Récupérer toutes les catégories de plats' })
  @ApiResponse({ status: 200, description: 'Liste des catégories récupérée avec succès.' })
  async getCategories() {
    return this.dishService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un plat par son ID' })
  @ApiResponse({ status: 200, description: 'Le plat a été trouvé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un plat' })
  @ApiResponse({ status: 200, description: 'Le plat a été mis à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async update(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    return this.dishService.update(id, updateDishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un plat' })
  @ApiResponse({ status: 200, description: 'Le plat a été supprimé avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }

  @Put(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour la disponibilité d\'un plat' })
  @ApiResponse({ status: 200, description: 'La disponibilité du plat a été mise à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async updateAvailability(
    @Param('id') id: string,
    @Body('is_available') isAvailable: boolean,
  ) {
    return this.dishService.updateAvailability(id, isAvailable);
  }
}
