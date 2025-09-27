import { User, UserInput } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

// Type pour l'utilisateur Prisma
interface PrismaUser {
  id: string;
  fullName: string;
  nom: string | null;
  prenom: string | null;
  sexe: string | null;
  phoneNumber: string;
  email: string | null;
  password: string | null;
  isActive: boolean;
  role: string;
  otpCode: string | null;
  otpExpiresAt: Date | null;
  otpVerified: boolean;
  otpSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(prismaUser: PrismaUser | null): User | null {
    if (!prismaUser) return null;

    return {
      id: prismaUser.id,
      fullName: prismaUser.fullName,
      phoneNumber: prismaUser.phoneNumber,
      email: prismaUser.email,
      password: prismaUser.password,
      role: prismaUser.role,
      nom: prismaUser.nom ?? undefined,
      prenom: prismaUser.prenom ?? undefined,
      sexe: prismaUser.sexe ?? undefined,
      otpCode: prismaUser.otpCode ?? undefined,
      otpExpiresAt: prismaUser.otpExpiresAt ?? undefined,
      otpVerified: prismaUser.otpVerified,
      otpSentAt: prismaUser.otpSentAt ?? undefined,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  async create(
    userInput: UserInput & {
      isActive?: boolean;
      otpCode?: string | null;
      otpExpiresAt?: Date | null;
      otpVerified?: boolean;
      otpSentAt?: Date | null;
    },
  ): Promise<User> {
    // Créer un nouvel utilisateur avec les propriétés requises
    const createdUser = await this.prisma.user.create({
      data: {
        fullName: userInput.fullName,
        phoneNumber: userInput.phoneNumber,
        isActive: userInput.isActive ?? false,
        role: userInput.role ?? "USER",
        nom: userInput.nom ?? null,
        prenom: userInput.prenom ?? null,
        sexe: userInput.sexe ?? null,
        email: userInput.email ?? null,
        password: userInput.password ?? null,
        otpCode: "otpCode" in userInput ? userInput.otpCode : null,
        otpExpiresAt:
          "otpExpiresAt" in userInput ? userInput.otpExpiresAt : null,
        otpVerified: "otpVerified" in userInput ? userInput.otpVerified : false,
        otpSentAt: "otpSentAt" in userInput ? userInput.otpSentAt : null,
      },
    });

    const domainUser = this.toDomain(createdUser);
    if (!domainUser) {
      throw new Error("Failed to create user");
    }
    return domainUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return this.toDomain(user);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });
    return this.toDomain(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      const domainUser = this.toDomain(updatedUser);
      if (!domainUser) {
        throw new Error("User not found after update");
      }
      return domainUser;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error occurred while updating user";
      throw new Error(`Failed to update user: ${errorMessage}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });
    return this.toDomain(user);
  }

  async createUserWithOtp(userData: {
    fullName: string;
    phoneNumber: string;
    otpCode: string;
    otpExpiresAt: Date;
    email?: string;
    nom?: string;
    prenom?: string;
    sexe?: string;
  }): Promise<User> {
    return this.create({
      ...userData,
      otpVerified: false,
      otpSentAt: new Date(),
      isActive: false,
    });
  }

  async updateOtp(updateData: {
    phoneNumber: string;
    otpCode?: string;
    otpExpiresAt?: Date | null;
    otpVerified?: boolean;
    otpSentAt?: Date | null;
  }): Promise<User> {
    const { phoneNumber, ...updateFields } = updateData;
    const updatedUser = await this.prisma.user.update({
      where: { phoneNumber },
      data: updateFields,
    });

    const domainUser = this.toDomain(updatedUser);
    if (!domainUser) {
      throw new Error("User not found");
    }
    return domainUser;
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      return false;
    }

    // Ici, vous devriez utiliser une bibliothèque de hachage comme bcrypt
    return user.password === password; // À remplacer par une vérification sécurisée
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async completeRegistration(data: {
    userId: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.update(data.userId, {
      email: data.email,
      password: data.password,
      isActive: true,
      otpVerified: true,
    });
  }

  async findUserWithRole(
    userId: string,
  ): Promise<(User & { role: string }) | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const domainUser = this.toDomain(user);
    if (!domainUser) {
      return null;
    }

    return {
      ...domainUser,
      role: user.role,
    };
  }

  async findByOtpCode(otpCode: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { otpCode },
    });
    return this.toDomain(user);
  }

  async updateOtpInfo(
    id: string,
    data: {
      otpCode: string;
      otpExpiresAt: Date;
      otpSentAt: Date;
    },
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        otpCode: data.otpCode,
        otpExpiresAt: data.otpExpiresAt,
        otpSentAt: data.otpSentAt,
        updatedAt: new Date(),
      },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByPhoneNumber(phoneNumber: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { phoneNumber },
    });
    return count > 0;
  }
}
