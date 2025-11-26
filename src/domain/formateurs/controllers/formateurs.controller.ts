import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  Put, 
  Delete, 
  HttpStatus, 
  HttpException, 
  UsePipes, 
  ValidationPipe,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { FormateurService } from '../../../application/use-cases/formateurs/formateur.service';
import { CreateFormateurDto } from '../dto/create-formateur.dto';
import { UpdateFormateurDto } from '../dto/update-formateur.dto';
import { Formateur } from '../entities/formateur.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('formateurs')
@Controller('formateurs')
export class FormateursController {
  constructor(private readonly formateurService: FormateurService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau formateur' })
  @ApiResponse({ status: 201, description: 'Le formateur a été créé avec succès.', type: Formateur })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 409, description: 'Un formateur avec cet email existe déjà.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createFormateurDto: CreateFormateurDto): Promise<Formateur> {
    try {
      return await this.formateurService.create(createFormateurDto);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du formateur';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les formateurs' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page (par défaut: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page (par défaut: 10, max: 100)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Terme de recherche' })
  @ApiResponse({ status: 200, description: 'Liste des formateurs récupérée avec succès.', type: [Formateur] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string
  ) {
    try {
      return await this.formateurService.findAll(page, limit, search);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des formateurs';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un formateur par son ID' })
  @ApiParam({ name: 'id', description: 'ID du formateur' })
  @ApiResponse({ status: 200, description: 'Le formateur a été trouvé.', type: Formateur })
  @ApiResponse({ status: 404, description: 'Formateur non trouvé.' })
  async findOne(@Param('id') id: string): Promise<Formateur> {
    try {
      return await this.formateurService.findOne(id);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Formateur avec l'ID "${id}" non trouvé`,
          HttpStatus.NOT_FOUND
        );
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du formateur';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un formateur' })
  @ApiParam({ name: 'id', description: 'ID du formateur à mettre à jour' })
  @ApiResponse({ status: 200, description: 'Le formateur a été mis à jour avec succès.', type: Formateur })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Formateur non trouvé.' })
  @ApiResponse({ status: 409, description: 'Un formateur avec cet email existe déjà.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateFormateurDto: UpdateFormateurDto
  ): Promise<Formateur> {
    try {
      return await this.formateurService.update(id, updateFormateurDto);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Formateur avec l'ID "${id}" non trouvé`,
          HttpStatus.NOT_FOUND
        );
      } else if (error instanceof ConflictException) {
        throw new HttpException(
          'Un formateur avec cet email existe déjà',
          HttpStatus.CONFLICT
        );
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du formateur';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un formateur' })
  @ApiParam({ name: 'id', description: 'ID du formateur à supprimer' })
  @ApiResponse({ status: 200, description: 'Le formateur a été supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Formateur non trouvé.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.formateurService.remove(id);
      return { message: `Le formateur avec l'ID "${id}" a été supprimé avec succès` };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Formateur avec l'ID "${id}" non trouvé`,
          HttpStatus.NOT_FOUND
        );
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du formateur';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('specialite/:specialite')
  @ApiOperation({ summary: 'Trouver des formateurs par spécialité' })
  @ApiParam({ name: 'specialite', description: 'Spécialité à rechercher' })
  @ApiResponse({ status: 200, description: 'Liste des formateurs trouvés.', type: [Formateur] })
  async findBySpecialite(@Param('specialite') specialite: string): Promise<Formateur[]> {
    try {
      return await this.formateurService.findBySpecialite(specialite);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la recherche par spécialité';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('disponibilite/:disponibilite')
  @ApiOperation({ summary: 'Trouver des formateurs par disponibilité' })
  @ApiParam({ name: 'disponibilite', description: 'Disponibilité à rechercher' })
  @ApiResponse({ status: 200, description: 'Liste des formateurs disponibles.', type: [Formateur] })
  async findByDisponibilite(@Param('disponibilite') disponibilite: string): Promise<Formateur[]> {
    try {
      return await this.formateurService.findByDisponibilite(disponibilite);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la recherche par disponibilité';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
