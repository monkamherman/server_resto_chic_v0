import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../src/infrastructure/prisma/prisma.service';
import { PrismaFormateurRepository } from '../../../../src/domain/formateurs/repositories/prisma/prisma-formateur.repository';
import { Formateur } from '../../../../src/domain/formateurs/entities/formateur.entity';
import { CreateFormateurDto } from '../../../../src/domain/formateurs/dto/create-formateur.dto';
import { UpdateFormateurDto } from '../../../../src/domain/formateurs/dto/update-formateur.dto';

describe('PrismaFormateurRepository', () => {
  let repository: PrismaFormateurRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockFormateur: Formateur = {
    id: '1',
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@example.com',
    specialites: ['JavaScript', 'TypeScript'],
    disponibilites: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
    statut: 'DISPONIBLE',
    telephone: '+33612345678',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    formateur: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $on: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaFormateurRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaFormateurRepository>(PrismaFormateurRepository);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const createFormateurDto: CreateFormateurDto = {
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@example.com',
      specialites: ['JavaScript', 'TypeScript'],
      disponibilites: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
      statut: 'DISPONIBLE',
      telephone: '+33612345678',
    };

    it('should create a new formateur', async () => {
      prismaService.formateur.create.mockResolvedValue(mockFormateur);

      const result = await repository.create(createFormateurDto);
      
      expect(prismaService.formateur.create).toHaveBeenCalledWith({
        data: {
          ...createFormateurDto,
          specialites: {
            set: createFormateurDto.specialites,
          },
          disponibilites: {
            set: createFormateurDto.disponibilites,
          },
        },
      });
      expect(result).toEqual(mockFormateur);
    });
  });

  describe('findAll', () => {
    it('should return paginated formateurs', async () => {
      const mockFormateurs = [mockFormateur];
      const total = 1;
      
      prismaService.formateur.findMany.mockResolvedValue(mockFormateurs);
      prismaService.formateur.count.mockResolvedValue(total);

      const result = await repository.findAll(1, 10);
      
      expect(prismaService.formateur.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { nom: 'asc' },
      });
      expect(result).toEqual({
        data: mockFormateurs,
        total,
      });
    });

    it('should apply search filter', async () => {
      const search = 'Jean';
      await repository.findAll(1, 10, search);
      
      expect(prismaService.formateur.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { prenom: { contains: search, mode: 'insensitive' } },
            { nom: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: { nom: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a formateur by id', async () => {
      prismaService.formateur.findUnique.mockResolvedValue(mockFormateur);

      const result = await repository.findOne('1');
      
      expect(prismaService.formateur.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockFormateur);
    });

    it('should return null if formateur not found', async () => {
      prismaService.formateur.findUnique.mockResolvedValue(null);

      const result = await repository.findOne('999');
      
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateFormateurDto: UpdateFormateurDto = {
      prenom: 'Jean-Pierre',
      specialitesToAdd: ['React'],
      specialitesToRemove: ['TypeScript'],
    };

    const updatedFormateur = {
      ...mockFormateur,
      prenom: 'Jean-Pierre',
      specialites: ['JavaScript', 'React'],
    };

    it('should update a formateur', async () => {
      prismaService.formateur.update.mockResolvedValue(updatedFormateur);

      const result = await repository.update('1', updateFormateurDto);
      
      expect(prismaService.formateur.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          prenom: 'Jean-Pierre',
          specialites: {
            push: ['React'],
            set: ['JavaScript'],
          },
        },
      });
      expect(result).toEqual(updatedFormateur);
    });
  });

  describe('remove', () => {
    it('should delete a formateur', async () => {
      await repository.remove('1');
      
      expect(prismaService.formateur.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('exists', () => {
    it('should return true if formateur exists', async () => {
      prismaService.formateur.count.mockResolvedValue(1);

      const result = await repository.exists('jean.dupont@example.com');
      
      expect(prismaService.formateur.count).toHaveBeenCalledWith({
        where: { 
          email: 'jean.dupont@example.com',
          id: { not: undefined },
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if formateur does not exist', async () => {
      prismaService.formateur.count.mockResolvedValue(0);

      const result = await repository.exists('nonexistent@example.com');
      
      expect(result).toBe(false);
    });
  });

  describe('findBySpecialite', () => {
    it('should return formateurs by specialite', async () => {
      prismaService.formateur.findMany.mockResolvedValue([mockFormateur]);

      const result = await repository.findBySpecialite('JavaScript');
      
      expect(prismaService.formateur.findMany).toHaveBeenCalledWith({
        where: {
          specialites: {
            hasSome: ['JavaScript'],
          },
        },
      });
      expect(result).toEqual([mockFormateur]);
    });
  });

  describe('findByDisponibilite', () => {
    it('should return formateurs by disponibilite', async () => {
      prismaService.formateur.findMany.mockResolvedValue([mockFormateur]);

      const result = await repository.findByDisponibilite('LUNDI_MATIN');
      
      expect(prismaService.formateur.findMany).toHaveBeenCalledWith({
        where: {
          disponibilites: {
            hasSome: ['LUNDI_MATIN'],
          },
        },
      });
      expect(result).toEqual([mockFormateur]);
    });
  });
});
