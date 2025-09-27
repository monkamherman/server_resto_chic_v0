import { User } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  // CRUD de base
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  
  // Méthodes spécifiques
  findByOtpCode(otpCode: string): Promise<User | null>;
  updateOtpInfo(
    id: string, 
    data: {
      otpCode: string;
      otpExpiresAt: Date;
      otpSentAt: Date;
    }
  ): Promise<void>;
  
  // Méthodes de vérification
  existsByEmail(email: string): Promise<boolean>;
  existsByPhoneNumber(phoneNumber: string): Promise<boolean>;
}
