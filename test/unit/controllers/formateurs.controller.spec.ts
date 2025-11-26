import { Test, TestingModule } from '@nestjs/testing';
import { FormateursController } from '../../../src/domain/formateurs/controllers/formateurs.controller';
import { FormateurService } from '../../../src/application/use-cases/formateurs/formateur.service';
import { CreateFormateurDto } from '../../../src/domain/formateurs/dto/create-formateur.dto';
import { UpdateFormateurDto } from '../../../src/domain/formateurs/dto/update-formateur.dto';
import { Formateur } from '../../../src/domain/formateurs/entities/formateur.entity';

describe('FormateursController', () => {
  let controller: FormateursController;
  let service: {
    create: jest.Mock<Promise<Formateur>, [CreateFormateurDto]>;
    findAll: jest.Mock<Promise<{ data: Formateur[]; total: number }>, [number, number, string?]>;
    findOne: jest.Mock<Promise<Formateur>, [string]>;
    update: jest.Mock<Promise<Formateur>, [string, UpdateFormateurDto]>;
    remove: jest.Mock<Promise<void>, [string]>;
    findBySpecialite: jest.Mock<Promise<Formateur[]>, [string]>;
    findByDisponibilite: jest.Mock<Promise<Formateur[]>, [string]>;
  };

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

  beforeEach(async () => {
    const mockFormateurService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findBySpecialite: jest.fn(),
      findByDisponibilite: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormateursController],
      providers: [
        {
          provide: FormateurService,
          useValue: mockFormateurService,
        },
      ],
    }).compile();

    controller = module.get<FormateursController>(FormateursController);
    service = mockFormateurService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new formateur', async () => {
      const createFormateurDto: CreateFormateurDto = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        specialites: ['JavaScript', 'TypeScript'],
        disponibilites: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
        statut: 'DISPONIBLE',
        telephone: '+33612345678',
      };

      service.create.mockResolvedValue(mockFormateur);

      const result = await controller.create(createFormateurDto);
      
      expect(service.create).toHaveBeenCalledWith(createFormateurDto);
      expect(result).toEqual(mockFormateur);
    });
  });

  describe('findAll', () => {
    it('should return an array of formateurs', async () => {
      const result = {
        data: [mockFormateur],
        total: 1,
      };
      
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe('findOne', () => {
    it('should return a single formateur', async () => {
      service.findOne.mockResolvedValue(mockFormateur);

      expect(await controller.findOne('1')).toBe(mockFormateur);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a formateur', async () => {
      const updateFormateurDto: UpdateFormateurDto = {
        prenom: 'Jean-Pierre',
      };

      const updatedFormateur = {
        ...mockFormateur,
        ...updateFormateurDto,
      };

      service.update.mockResolvedValue(updatedFormateur);

      expect(await controller.update('1', updateFormateurDto)).toBe(updatedFormateur);
      expect(service.update).toHaveBeenCalledWith('1', updateFormateurDto);
    });
  });

  describe('remove', () => {
    it('should delete a formateur', async () => {
      service.remove.mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toEqual({
        message: 'Le formateur avec l\'ID "1" a été supprimé avec succès',
      });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('findBySpecialite', () => {
    it('should return formateurs by specialite', async () => {
      service.findBySpecialite.mockResolvedValue([mockFormateur]);

      expect(await controller.findBySpecialite('JavaScript')).toEqual([mockFormateur]);
      expect(service.findBySpecialite).toHaveBeenCalledWith('JavaScript');
    });
  });

  describe('findByDisponibilite', () => {
    it('should return formateurs by disponibilite', async () => {
      service.findByDisponibilite.mockResolvedValue([mockFormateur]);

      expect(await controller.findByDisponibilite('LUNDI_MATIN')).toEqual([mockFormateur]);
      expect(service.findByDisponibilite).toHaveBeenCalledWith('LUNDI_MATIN');
    });
  });
});
