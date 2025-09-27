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

// Symboles d'injection
export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),

  // Services
  UserService: Symbol.for("UserService"),
  AuthService: Symbol.for("AuthService"),
  ProfileService: Symbol.for("ProfileService"),

  // Controllers
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
  ProfileController: Symbol.for("ProfileController"),

  // Middlewares
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  ErrorMiddleware: Symbol.for("ErrorMiddleware"),

  // Utils
  Logger: Symbol.for("Logger"),
  Config: Symbol.for("Config"),
} as const;
