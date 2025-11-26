import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@application/use-cases/user/user.service';
import { AuthService } from '@application/use-cases/auth/auth.service';
import { UserRole } from '@domain/users/enums/user-role.enum';
import { RegisterDto } from '@interfaces/controllers/auth/dto/register.dto';

interface ErrorWithMessage extends Error {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Créer une instance des services nécessaires
const configService = new ConfigService();
const jwtService = new JwtService({
  secret: configService.get<string>('JWT_SECRET') || 'secretKey',
  signOptions: { expiresIn: '1h' },
});

// Créer une instance factice de UserRepository pour UserService
const mockUserRepository = {
  // Implémentez les méthodes nécessaires ici
  findByEmail: () => Promise.resolve(null),
  findByPhoneNumber: () => Promise.resolve(null),
  findById: () => Promise.resolve(null),
  create: () => Promise.resolve({
    id: 'mock-user-id',
    email: 'mock@example.com',
    password: 'hashedpassword',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const),
  update: () => Promise.resolve({
    id: 'mock-user-id',
    email: 'mock@example.com',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const),
  delete: () => Promise.resolve(true),
  findAll: () => Promise.resolve([]),
  exists: () => Promise.resolve(false),
  findByRole: () => Promise.resolve([]),
  updatePassword: () => Promise.resolve(true),
};

const userService = new UserService(mockUserRepository);
const authService = new AuthService(userService, jwtService, configService);

export default {
  async signup(req: Request, res: Response) {
    try {
      // Extraire les champs du corps de la requête
      const { email, password, fullName, phoneNumber, nom, prenom, sexe } = req.body;
      
      // Créer un objet RegisterDto avec les champs requis
      const registerDto: RegisterDto = {
        email, // email est optionnel dans le DTO
        password,
        fullName,
        phoneNumber,
        role: UserRole.USER,
        nom,
        prenom,
        sexe
      };
      
      const result = await authService.register(registerDto);
      res.status(201).json(result);
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Une erreur est survenue lors de l\'inscription';
      res.status(400).json({ message: errorMessage });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.validateUserByEmail(email, password);
      res.json(result);
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Identifiants invalides';
      res.status(401).json({ message: errorMessage });
    }
  },

  async me(req: UserRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Non authentifié' });
      }
      res.json(user);
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Erreur serveur';
      res.status(500).json({ message: errorMessage });
    }
  },

  async logout(req: UserRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (userId) {
        // Implémentez la logique de déconnexion si nécessaire
        // Par exemple, invalider le token JWT côté serveur
      }
      res.clearCookie('refreshToken');
      res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Erreur lors de la déconnexion';
      res.status(500).json({ message: errorMessage });
    }
  }
};
