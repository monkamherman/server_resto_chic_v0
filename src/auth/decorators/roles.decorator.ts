import { SetMetadata } from '@nestjs/common';

// Définition locale du type UserRole pour éviter les dépendances circulaires
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
  GUEST = 'guest'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
