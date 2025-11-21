import { UserRole } from '@domain/users/enums/user-role.enum';

declare global {
  namespace Express {
    // Interface pour l'utilisateur authentifié
    interface AuthUser {
      id: string;
      email: string;
      role: UserRole;
    }

    // Extension de l'interface Request de base
    interface Request {
      user?: AuthUser;
    }
  }
}

// Cette déclaration est nécessaire pour que TypeScript traite ce fichier comme un module
export {};
