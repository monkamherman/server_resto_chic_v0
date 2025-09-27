import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPut,
  request,
  response,
} from "inversify-express-utils";
import { TYPES } from "@shared/constants/injection.types";
import { IProfileService } from "@application/services/IProfileService";
import { User, UserUpdateInput } from "@domain/entities/User";

// Types personnalisés
type AuthUser = {
  id: string;
  email: string;
  role: string;
};

type UploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  path: string; // Ajout de la propriété path manquante
};

@controller("/profile")
export class ProfileController {
  constructor(
    @inject(TYPES.ProfileService) private profileService: IProfileService,
  ) {}

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  @httpGet("/")
  async getProfile(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const authUser = req.user as AuthUser | undefined;
      if (!authUser) {
        res.status(401).json({
          success: false,
          message: "Non autorisé",
        });
        return;
      }
      const userId = authUser.id;

      const user = await this.profileService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: this.formatUserResponse(user),
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération du profil";
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  /**
   * Met à jour le profil de l'utilisateur connecté
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AuthUser | undefined;
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Non autorisé",
        });
        return;
      }
      const userId = user.id;
      const updateData: UserUpdateInput = req.body;

      const updatedUser = await this.profileService.updateUserProfile(
        userId,
        updateData,
      );

      res.status(200).json({
        success: true,
        message: "Profil mis à jour avec succès",
        data: this.formatUserResponse(updatedUser),
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du profil";
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  /**
   * Change le mot de passe de l'utilisateur connecté
   */
  @httpPut("/change-password")
  async changePassword(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const user = req.user as AuthUser | undefined;
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Non autorisé",
        });
        return;
      }
      const userId = user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message:
            "Le mot de passe actuel et le nouveau mot de passe sont requis",
        });
        return;
      }

      await this.profileService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      res.status(200).json({
        success: true,
        message: "Mot de passe modifié avec succès",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors du changement de mot de passe";
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  /**
   * Met à jour la photo de profil
   */
  async updateProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AuthUser | undefined;
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Non autorisé",
        });
        return;
      }
      const userId = user.id;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Aucun fichier téléchargé",
        });
        return;
      }

      const file = req.file as UploadedFile | undefined;
      if (!file) {
        res.status(400).json({
          success: false,
          message: "Erreur lors du traitement du fichier",
        });
        return;
      }
      const filePath = file.path;
      const updatedUser = await this.profileService.updateProfilePicture(
        userId,
        filePath,
      );

      res.status(200).json({
        success: true,
        message: "Photo de profil mise à jour avec succès",
        data: this.formatUserResponse(updatedUser),
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour de la photo de profil";
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  /**
   * Formate la réponse utilisateur pour éviter d'envoyer des données sensibles
   */
  private formatUserResponse(
    user: User | null,
  ): Omit<User, "password" | "otpCode" | "otpExpiresAt"> | null {
    if (!user) return null;

    // Variables marquées comme non utilisées intentionnellement
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, otpCode, otpExpiresAt, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }
}
