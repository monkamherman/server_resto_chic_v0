// Tokens d'injection pour Inversify
export const TYPES = {
  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  ProfileService: Symbol.for('ProfileService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  
  // Autres dépendances
  // ...
} as const;

export type TYPES = typeof TYPES[keyof typeof TYPES];
