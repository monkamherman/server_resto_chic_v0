import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../repositories/user-repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Créer un nouvel utilisateur avec les valeurs par défaut
    const newUser = {
      ...createUserDto,
      isActive: true,
      role: createUserDto.role || 'user'
    };

    return this.userRepository.create(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string): Promise<void> {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    
    if (!user || !user.refreshToken) {
      throw new Error('User not found or no refresh token');
    }

    if (user.refreshToken === refreshToken) {
      return user;
    }
    
    throw new Error('Invalid refresh token');
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }
}
