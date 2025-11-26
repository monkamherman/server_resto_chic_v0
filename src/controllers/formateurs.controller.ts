import { Request, Response } from 'express';
import { FormateurService } from '../application/use-cases/formateurs/formateur.service';
import { CreateFormateurDto } from '../domain/formateurs/dto/create-formateur.dto';
import { UpdateFormateurDto } from '../domain/formateurs/dto/update-formateur.dto';
import { Formateur } from '../domain/formateurs/entities/formateur.entity';
import { IFormateurRepository } from '../domain/formateurs/repositories/formateur.repository';

// Pour l'instant, nous allons créer une implémentation factice du repository
// Dans une application réelle, cela serait injecté via le système d'injection de dépendances
class MockFormateurRepository implements IFormateurRepository {
  private formateurs: Formateur[] = [];

  async create(createFormateurDto: CreateFormateurDto): Promise<Formateur> {
    const formateur = {
      id: Math.random().toString(36).substring(2, 9),
      ...createFormateurDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.formateurs.push(formateur);
    return formateur;
  }

  async findAll(page: number, limit: number, search?: string): Promise<{ data: Formateur[]; total: number }> {
    // Implémentation simplifiée pour l'exemple
    let filteredFormateurs = this.formateurs;
    
    // Filtrer par recherche si un terme est fourni
    if (search) {
      const searchLower = search.toLowerCase();
      filteredFormateurs = this.formateurs.filter(formateur => 
        formateur.prenom.toLowerCase().includes(searchLower) ||
        formateur.nom.toLowerCase().includes(searchLower) ||
        formateur.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filteredFormateurs.slice(start, end);
    
    return { 
      data, 
      total: filteredFormateurs.length 
    };
  }

  async findOne(id: string): Promise<Formateur | null> {
    return this.formateurs.find(f => f.id === id) || null;
  }

  async update(id: string, updateFormateurDto: UpdateFormateurDto): Promise<Formateur> {
    const index = this.formateurs.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Formateur non trouvé');
    }
    this.formateurs[index] = { ...this.formateurs[index], ...updateFormateurDto, updatedAt: new Date() };
    return this.formateurs[index];
  }

  async remove(id: string): Promise<void> {
    this.formateurs = this.formateurs.filter(f => f.id !== id);
  }

  async exists(email: string, excludeId?: string): Promise<boolean> {
    return this.formateurs.some(f => f.email === email && f.id !== excludeId);
  }

  async findBySpecialite(specialite: string): Promise<Formateur[]> {
    return this.formateurs.filter(formateur => 
      formateur.specialites.some(s => 
        s.toLowerCase().includes(specialite.toLowerCase())
      )
    );
  }

  async findByDisponibilite(disponibilite: string): Promise<Formateur[]> {
    return this.formateurs.filter(formateur => 
      formateur.disponibilites.some(dispo => 
        dispo.toLowerCase().includes(disponibilite.toLowerCase())
      )
    );
  }
}

// Initialisation du service avec le repository factice
const formateurService = new FormateurService(new MockFormateurRepository());

interface ErrorWithMessage extends Error {
  message: string;
  statusCode?: number;
  status?: number;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export default {
  async create(req: Request, res: Response) {
    try {
      const createFormateurDto: CreateFormateurDto = req.body;
      const formateur = await formateurService.create(createFormateurDto);
      
      res.status(201).json({ 
        success: true,
        message: 'Formateur créé avec succès',
        data: formateur
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Une erreur est survenue lors de la création du formateur';
      const statusCode = isErrorWithMessage(error) && (error.statusCode || error.status)
        ? error.statusCode || error.status
        : 500;
      
      res.status(statusCode as number).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      
      const result = await formateurService.findAll(page, limit, search);
      
      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Erreur lors de la récupération des formateurs';
      const statusCode = isErrorWithMessage(error) && error.statusCode 
        ? error.statusCode 
        : 500;
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du formateur manquant'
        });
      }
      
      const formateur = await formateurService.findOne(id);
      
      if (!formateur) {
        return res.status(404).json({
          success: false,
          message: 'Formateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: formateur
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Erreur lors de la récupération du formateur';
      const statusCode = isErrorWithMessage(error) && error.statusCode 
        ? error.statusCode 
        : 500;
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du formateur manquant'
        });
      }
      
      const updateFormateurDto: UpdateFormateurDto = req.body;
      const updatedFormateur = await formateurService.update(id, updateFormateurDto);
      
      res.json({
        success: true,
        message: 'Formateur mis à jour avec succès',
        data: updatedFormateur
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Erreur lors de la mise à jour du formateur';
      const statusCode = isErrorWithMessage(error) && error.statusCode 
        ? error.statusCode 
        : 500;
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du formateur manquant'
        });
      }
      
      await formateurService.remove(id);
      
      res.status(204).send();
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Erreur lors de la suppression du formateur';
      const statusCode = isErrorWithMessage(error) && error.statusCode 
        ? error.statusCode 
        : 500;
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
};
