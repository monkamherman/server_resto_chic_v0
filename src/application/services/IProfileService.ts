import { User, UserUpdateInput } from "../../domain/entities/User";

export interface IProfileService {
  /**
   * Récupère le profil d'un utilisateur
   * @param userId L'identifiant de l'utilisateur
   * @returns Les informations du profil de l'utilisateur
   */
  getUserProfile(userId: string): Promise<User>;

  /**
   * Met à jour le profil d'un utilisateur
   * @param userId L'identifiant de l'utilisateur
   * @param updateData Les données à mettre à jour
   * @returns L'utilisateur mis à jour
   */
  updateUserProfile(userId: string, updateData: UserUpdateInput): Promise<User>;

  /**
   * Change le mot de passe d'un utilisateur
   * @param userId L'identifiant de l'utilisateur
   * @param currentPassword Le mot de passe actuel
   * @param newPassword Le nouveau mot de passe
   */
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;

  /**
   * Met à jour la photo de profil d'un utilisateur
   * @param userId L'identifiant de l'utilisateur
   * @param filePath Le chemin du fichier de l'image
   * @returns L'utilisateur avec la photo de profil mise à jour
   */
  updateProfilePicture(userId: string, filePath: string): Promise<User>;
}
