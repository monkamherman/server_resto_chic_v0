import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { IUserRepository } from '../user-repository.interface';
import { User } from '../../entities/user.entity';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      username: prismaUser.phoneNumber, // On utilise phoneNumber comme identifiant unique
      email: prismaUser.email || undefined,
      password: prismaUser.password || undefined,
      firstName: prismaUser.prenom || undefined,
      lastName: prismaUser.nom || undefined,
      role: prismaUser.role,
      isActive: prismaUser.isActive,
      refreshToken: prismaUser.otpCode || undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
        nom: user.lastName,
        prenom: user.firstName,
        phoneNumber: user.username, // phoneNumber est l'identifiant unique
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        otpCode: user.refreshToken,
      },
    });

    return this.toDomain(createdUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.toDomain(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    return user ? this.toDomain(user) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    interface UpdateUserData {
      fullName?: string;
      nom?: string;
      prenom?: string;
      phoneNumber?: string;
      email?: string;
      password?: string;
      role?: string;
      isActive?: boolean;
      otpCode?: string;
      updatedAt: Date;
    }

    const data: UpdateUserData = {
      fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
      nom: user.lastName,
      prenom: user.firstName,
      phoneNumber: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      otpCode: user.refreshToken,
      updatedAt: new Date(),
    };

    // Créer un nouvel objet sans les champs undefined
    const cleanData: Partial<UpdateUserData> = {};
    
    if (data.fullName !== undefined) cleanData.fullName = data.fullName;
    if (data.nom !== undefined) cleanData.nom = data.nom;
    if (data.prenom !== undefined) cleanData.prenom = data.prenom;
    if (data.phoneNumber !== undefined) cleanData.phoneNumber = data.phoneNumber;
    if (data.email !== undefined) cleanData.email = data.email;
    if (data.password !== undefined) cleanData.password = data.password;
    if (data.role !== undefined) cleanData.role = data.role;
    if (data.isActive !== undefined) cleanData.isActive = data.isActive;
    if (data.otpCode !== undefined) cleanData.otpCode = data.otpCode;
    cleanData.updatedAt = data.updatedAt; // Toujours présent

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: cleanData,
    });
    
    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    // Dans notre schéma, le username est stocké dans phoneNumber
    const user = await this.prisma.user.findFirst({
      where: { 
        OR: [
          { phoneNumber: username },
          { email: username }
        ]
      },
    });
    return user ? this.toDomain(user) : null;
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        otpCode: refreshToken,
        otpExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours d'expiration
      },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { 
        otpCode: refreshToken,
        otpExpiresAt: {
          gt: new Date() // Vérifie que le token n'est pas expiré
        }
      },
    });
    return user ? this.toDomain(user) : null;
  }
}
