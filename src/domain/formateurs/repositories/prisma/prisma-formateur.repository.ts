import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { Formateur, FormateurStatut } from '../../entities/formateur.entity';
import { IFormateurRepository } from '../formateur.repository';
import { CreateFormateurDto } from '../../dto/create-formateur.dto';
import { UpdateFormateurDto } from '../../dto/update-formateur.dto';

@Injectable()
export class PrismaFormateurRepository implements IFormateurRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(formateur: any): Formateur {
    return new Formateur({
      id: formateur.id,
      prenom: formateur.prenom,
      nom: formateur.nom,
      email: formateur.email,
      telephone: formateur.telephone,
      specialites: formateur.specialites,
      disponibilites: formateur.disponibilites,
      statut: formateur.statut as FormateurStatut,
      createdAt: formateur.createdAt,
      updatedAt: formateur.updatedAt,
    });
  }

  async create(createFormateurDto: CreateFormateurDto): Promise<Formateur> {
    const formateur = await this.prisma.formateur.create({
      data: {
        ...createFormateurDto,
        specialites: {
          set: createFormateurDto.specialites || [],
        },
        disponibilites: {
          set: createFormateurDto.disponibilites || [],
        },
      },
    });
    return this.toDomain(formateur);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Formateur[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { prenom: { contains: search, mode: 'insensitive' } },
            { nom: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      this.prisma.formateur.count({ where }),
      this.prisma.formateur.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nom: 'asc' },
      }),
    ]);

    return {
      data: items.map((item) => this.toDomain(item)),
      total,
    };
  }

  async findOne(id: string): Promise<Formateur | null> {
    const formateur = await this.prisma.formateur.findUnique({
      where: { id },
    });
    return formateur ? this.toDomain(formateur) : null;
  }

  async update(
    id: string,
    updateFormateurDto: UpdateFormateurDto,
  ): Promise<Formateur> {
    const { specialitesToAdd, specialitesToRemove, disponibilitesToAdd, disponibilitesToRemove, ...data } =
      updateFormateurDto;

    const updateData: any = { ...data };

    if (specialitesToAdd || specialitesToRemove) {
      updateData.specialites = {
        push: specialitesToAdd || [],
        set: specialitesToRemove
          ? {
              set: (await this.findOne(id))?.specialites.filter(
                (s) => !specialitesToRemove.includes(s),
              ),
            }
          : undefined,
      };
    }

    if (disponibilitesToAdd || disponibilitesToRemove) {
      updateData.disponibilites = {
        push: disponibilitesToAdd || [],
        set: disponibilitesToRemove
          ? {
              set: (await this.findOne(id))?.disponibilites.filter(
                (d) => !disponibilitesToRemove.includes(d),
              ),
            }
          : undefined,
      };
    }

    const updatedFormateur = await this.prisma.formateur.update({
      where: { id },
      data: updateData,
    });

    return this.toDomain(updatedFormateur);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.formateur.delete({
      where: { id },
    });
  }

  async exists(email: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.formateur.count({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return count > 0;
  }

  async findBySpecialite(specialite: string): Promise<Formateur[]> {
    const formateurs = await this.prisma.formateur.findMany({
      where: {
        specialites: {
          hasSome: [specialite],
        },
      },
    });
    return formateurs.map((f) => this.toDomain(f));
  }

  async findByDisponibilite(disponibilite: string): Promise<Formateur[]> {
    const formateurs = await this.prisma.formateur.findMany({
      where: {
        disponibilites: {
          hasSome: [disponibilite],
        },
      },
    });
    return formateurs.map((f) => this.toDomain(f));
  }
}
