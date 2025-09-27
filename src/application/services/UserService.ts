import { inject, injectable } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { TYPES } from "../../shared/constants/injection.types";
import { User, UserInput, UserUpdateInput } from "../../domain/entities/User";
import bcrypt from "bcrypt";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  async createUser(userData: UserInput): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    if (!userData.email) {
      throw new Error("L'email est obligatoire pour créer un utilisateur");
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Hasher le mot de passe
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : undefined;

    // Créer l'utilisateur
    return this.userRepository.create({
      ...userData,
      password: hashedPassword || "",
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Trouve un utilisateur par son numéro de téléphone
   * @param phoneNumber Le numéro de téléphone à rechercher
   * @returns L'utilisateur correspondant ou null si non trouvé
   */
  async getUserByPhone(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findByPhone(phoneNumber);
  }

  async updateUser(id: string, userData: UserUpdateInput): Promise<User> {
    // Si le mot de passe est fourni, le hasher
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) {
      throw new Error("Échec de la mise à jour de l'utilisateur");
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async registerWithOtp(userData: {
    fullName: string;
    phoneNumber: string;
    otpCode: string;
    otpExpiresAt: Date;
    email?: string;
    nom?: string;
    prenom?: string;
    sexe?: string;
  }): Promise<User> {
    return this.userRepository.createUserWithOtp(userData);
  }

  async verifyOtp(phoneNumber: string, otpCode: string): Promise<User> {
    const user = await this.userRepository.findByPhone(phoneNumber);

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.otpCode !== otpCode) {
      throw new Error("Code OTP invalide");
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new Error("Le code OTP a expiré");
    }

    // Mise à jour de l'OTP avec les valeurs correctes
    return this.userRepository.updateOtp({
      phoneNumber,
      otpVerified: true,
      otpCode: undefined, // Utiliser undefined au lieu de null pour éviter les problèmes de typage
      otpExpiresAt: undefined,
      otpSentAt: undefined,
    });
  }

  async completeRegistration(data: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.userRepository.completeRegistration({
      ...data,
      password: hashedPassword,
    });
  }

  async resendOtp(phoneNumber: string, otpCode: string): Promise<User> {
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 30);

    return this.userRepository.updateOtp({
      phoneNumber,
      otpCode,
      otpExpiresAt,
      otpVerified: false,
      otpSentAt: new Date(),
    });
  }
}
