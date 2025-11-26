import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Formateur } from '../../../domain/formateurs/entities/formateur.entity';
import { IFormateurRepository } from '../../../domain/formateurs/repositories/formateur.repository';
import { CreateFormateurDto } from '../../../domain/formateurs/dto/create-formateur.dto';
import { UpdateFormateurDto } from '../../../domain/formateurs/dto/update-formateur.dto';

@Injectable()
export class FormateurService {
  constructor(private readonly formateurRepository: IFormateurRepository) {}

  async create(createFormateurDto: CreateFormateurDto): Promise<Formateur> {
    // Vérifier si un formateur avec cet email existe déjà
    const exists = await this.formateurRepository.exists(createFormateurDto.email);
    if (exists) {
      throw new ConflictException('Un formateur avec cet email existe déjà');
    }

    return this.formateurRepository.create(createFormateurDto);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ data: Formateur[]; total: number }> {
    if (page < 1) {
      throw new BadRequestException('Le numéro de page doit être supérieur à 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('La limite doit être comprise entre 1 et 100');
    }

    return this.formateurRepository.findAll(page, limit, search);
  }

  async findOne(id: string): Promise<Formateur> {
    const formateur = await this.formateurRepository.findOne(id);
    if (!formateur) {
      throw new NotFoundException(`Formateur avec l'ID "${id}" non trouvé`);
    }
    return formateur;
  }

  async update(id: string, updateFormateurDto: UpdateFormateurDto): Promise<Formateur> {
    // Vérifier si le formateur existe
    await this.findOne(id);

    // Vérifier si l'email est déjà utilisé par un autre formateur
    if (updateFormateurDto.email) {
      const exists = await this.formateurRepository.exists(updateFormateurDto.email, id);
      if (exists) {
        throw new ConflictException('Un formateur avec cet email existe déjà');
      }
    }

    return this.formateurRepository.update(id, updateFormateurDto);
  }

  async remove(id: string): Promise<void> {
    // Vérifier si le formateur existe
    await this.findOne(id);
    
    await this.formateurRepository.remove(id);
  }

  async findBySpecialite(specialite: string): Promise<Formateur[]> {
    return this.formateurRepository.findBySpecialite(specialite);
  }

  async findByDisponibilite(disponibilite: string): Promise<Formateur[]> {
    return this.formateurRepository.findByDisponibilite(disponibilite);
  }
}
