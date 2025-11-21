import { UserRole } from '../../../domain/users/enums/user-role.enum';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
      [key: string]: unknown;
    }
  }
}

export {};
