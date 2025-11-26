import { User } from '../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findByUsername(username: string): Promise<User | null>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<User | null>;
}
