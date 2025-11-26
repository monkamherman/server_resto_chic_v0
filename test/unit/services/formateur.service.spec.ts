import { Test, TestingModule } from '@nestjs/testing';
import { FormateurService } from '../../../src/application/use-cases/formateurs/formateur.service';
import { IFormateurRepository } from '../../../src/domain/formateurs/repositories/formateur.repository';
import { CreateFormateurDto } from '../../../src/domain/formateurs/dto/create-formateur.dto';
import { UpdateFormateurDto } from '../../../src/domain/formateurs/dto/update-formateur.dto';
import { Formateur } from '../../../src/domain/formateurs/entities/formateur.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FormateurService', () => {
  let service: FormateurService;
  let repository: jest.Mocked<IFormateurRepository>;

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

  const mockFormateurRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
    findBySpecialite: jest.fn(),
    findByDisponibilite: jest.fn(),
  } as jest.Mocked<IFormateurRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormateurService,
        {
          provide: 'IFormateurRepository',
          useValue: mockFormateurRepository,
        },
      ],
    }).compile();

    service = module.get<FormateurService>(FormateurService);
    repository = module.get<jest.Mocked<IFormateurRepository>>('IFormateurRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      repository.exists.mockResolvedValue(false);
      repository.create.mockResolvedValue(mockFormateur as Formateur);

      const result = await service.create(createFormateurDto);
      
      expect(repository.create).toHaveBeenCalledWith(createFormateurDto);
      expect(result).toEqual(mockFormateur);
    });

    it('should throw ConflictException if email already exists', async () => {
      repository.exists.mockResolvedValue(true);

      await expect(service.create(createFormateurDto)).rejects.toThrow(
        new ConflictException('Un formateur avec cet email existe déjà')
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated formateurs', async () => {
      const result = {
        data: [mockFormateur],
        total: 1,
      };
      
      repository.findAll.mockResolvedValue(result);

      expect(await service.findAll(1, 10)).toBe(result);
      expect(repository.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe('findOne', () => {
    it('should return a formateur by id', async () => {
      repository.findOne.mockResolvedValue(mockFormateur);

      const result = await service.findOne('1');
      
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockFormateur);
    });

    it('should throw NotFoundException if formateur not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Formateur avec l\'ID "999" non trouvé')
      );
    });
  });

  describe('update', () => {
    const updateFormateurDto: UpdateFormateurDto = {
      prenom: 'Jean-Pierre',
    };

    const updatedFormateur = {
      ...mockFormateur,
      ...updateFormateurDto,
    };

    it('should update a formateur', async () => {
      repository.findOne.mockResolvedValue(mockFormateur);
      repository.exists.mockResolvedValue(false);
      repository.update.mockResolvedValue(updatedFormateur);

      const result = await service.update('1', updateFormateurDto);
      
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(repository.update).toHaveBeenCalledWith('1', updateFormateurDto);
      expect(result).toEqual(updatedFormateur);
    });

    it('should throw NotFoundException if formateur not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateFormateurDto)).rejects.toThrow(
        new NotFoundException('Formateur avec l\'ID "999" non trouvé')
      );
    });

    it('should throw ConflictException if email is already taken', async () => {
      repository.findOne.mockResolvedValue(mockFormateur);
      repository.exists.mockResolvedValue(true);

      await expect(
        service.update('1', { email: 'existing@example.com' })
      ).rejects.toThrow(
        new ConflictException('Un formateur avec cet email existe déjà')
      );
    });
  });

  describe('remove', () => {
    it('should delete a formateur', async () => {
      repository.findOne.mockResolvedValue(mockFormateur);
      repository.remove.mockResolvedValue(undefined);

      await service.remove('1');
      
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(repository.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if formateur not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Formateur avec l\'ID "999" non trouvé')
      );
    });
  });

  describe('findBySpecialite', () => {
    it('should return formateurs by specialite', async () => {
      repository.findBySpecialite.mockResolvedValue([mockFormateur]);

      const result = await service.findBySpecialite('JavaScript');
      
      expect(repository.findBySpecialite).toHaveBeenCalledWith('JavaScript');
      expect(result).toEqual([mockFormateur]);
    });
  });

  describe('findByDisponibilite', () => {
    it('should return formateurs by disponibilite', async () => {
      repository.findByDisponibilite.mockResolvedValue([mockFormateur]);

      const result = await service.findByDisponibilite('LUNDI_MATIN');
      
      expect(repository.findByDisponibilite).toHaveBeenCalledWith('LUNDI_MATIN');
      expect(result).toEqual([mockFormateur]);
    });
  });
});
