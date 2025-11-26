import { Formateur } from '../entities/formateur.entity';
import { CreateFormateurDto } from '../dto/create-formateur.dto';
import { UpdateFormateurDto } from '../dto/update-formateur.dto';

export interface IFormateurRepository {
  create(createFormateurDto: CreateFormateurDto): Promise<Formateur>;
  findAll(page: number, limit: number, search?: string): Promise<{ data: Formateur[]; total: number }>;
  findOne(id: string): Promise<Formateur | null>;
  update(id: string, updateFormateurDto: UpdateFormateurDto): Promise<Formateur>;
  remove(id: string): Promise<void>;
  exists(email: string, excludeId?: string): Promise<boolean>;
  findBySpecialite(specialite: string): Promise<Formateur[]>;
  findByDisponibilite(disponibilite: string): Promise<Formateur[]>;
}
