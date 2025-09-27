// Types de base
export interface AuthUser {
  id: string;
  role: string;
  [key: string]: unknown;
}

// Déclaration de type pour les fichiers téléchargés
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

// Types pour les requêtes Express
declare module "express" {
  interface Request {
    user?: AuthUser;
    file?: UploadedFile;
    files?: { [fieldname: string]: UploadedFile[] } | UploadedFile[];
  }
}

// Symboles pour l'injection de dépendances
export const TYPES = {
  // Controllers
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
  ProfileController: Symbol.for("ProfileController"),

  // Services
  UserService: Symbol.for("UserService"),
  AuthService: Symbol.for("AuthService"),
  ProfileService: Symbol.for("ProfileService"),

  // Repositories
  UserRepository: Symbol.for("UserRepository"),

  // Middleware
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  // Utils
  Logger: Symbol.for("Logger"),
  Config: Symbol.for("Config"),
} as const;
