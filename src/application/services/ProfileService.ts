import { inject, injectable } from "inversify";
import { IProfileService } from "./IProfileService";
import { User, UserUpdateInput } from "@domain/entities/User";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { TYPES } from "@shared/constants/injection.types";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
  ) {}

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }

  async updateUserProfile(
    userId: string,
    updateData: UserUpdateInput,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Mettre à jour les champs autorisés
    const updatedUser = await this.userRepository.update(userId, updateData);
    return updatedUser;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await this.userRepository.verifyPassword(
      userId,
      currentPassword,
    );
    if (!isPasswordValid) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Mettre à jour le mot de passe
    await this.userRepository.updatePassword(userId, newPassword);
  }

  async updateProfilePicture(userId: string, filePath: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Mettre à jour la photo de profil
    const updatedUser = await this.userRepository.update(userId, {
      profilePicture: filePath,
    } as UserUpdateInput);

    return updatedUser;
  }
}
