import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserInput, UserUpdateInput } from "../../domain/entities/User";
import bcrypt from "bcrypt";

@injectable()
export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: UserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        fullName: user.fullName,
        email: user.email || null,
        phoneNumber: user.phoneNumber,
        password: user.password || null,
        role: user.role || "USER",
        nom: user.nom || null,
        prenom: user.prenom || null,
        sexe: user.sexe || null,
        otpVerified: false,
        isActive: false,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { phoneNumber },
    });
  }

  async update(id: string, userData: UserUpdateInput): Promise<User> {
    // Filtrer les champs undefined pour éviter d'écraser des valeurs existantes
    const updateData = Object.fromEntries(
      Object.entries(userData).filter(([, value]) => value !== undefined),
    );

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.user.delete({
      where: { id },
    });
    return !!result;
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      return false;
    }

    // Vérification du mot de passe avec bcrypt
    return bcrypt.compare(password, user.password);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
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
    return this.prisma.user.create({
      data: {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        email: userData.email || null,
        nom: userData.nom || null,
        prenom: userData.prenom || null,
        sexe: userData.sexe || null,
        otpCode: userData.otpCode,
        otpExpiresAt: userData.otpExpiresAt,
        otpVerified: false,
        isActive: false,
        role: "USER", // Default role
      },
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

    return this.prisma.user.update({
      where: { phoneNumber },
      data: updateFields,
    });
  }

  async completeRegistration(data: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Promise<User> {
    return this.prisma.user.update({
      where: { id: data.userId },
      data: {
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        otpVerified: true,
        isActive: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });
  }

  async findUserWithRole(
    userId: string,
  ): Promise<(User & { role: string }) | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return {
      ...user,
      role: user.role || "USER",
    };
  }
}
