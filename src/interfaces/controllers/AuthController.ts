import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { TYPES } from "@shared/constants/injection.types";
import { IAuthService } from "@application/services/IAuthService";
import { User } from "@domain/entities/User";

@controller("/auth")
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  /**
   * Connecte un utilisateur
   */
  @httpPost("/login")
  async login(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email et mot de passe sont obligatoires",
        });
        return;
      }

      const result = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Connexion réussie",
        data: {
          user: this.formatUserResponse(result.user),
          token: result.token,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de la connexion";
      res.status(400).json({
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && {
          error: error instanceof Error ? error.stack : error,
        }),
      });
    }
  }

  /**
   * Rafraîchit le token d'authentification
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body as { refreshToken?: string };

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: "Le refresh token est requis",
        });
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: "Token rafraîchi avec succès",
        data: {
          token: result.token,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors du rafraîchissement du token";
      res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  /**
   * Déconnecte un utilisateur
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(400).json({
          success: false,
          message: "Token manquant",
        });
        return;
      }

      await this.authService.logout(token);

      res.status(200).json({
        success: true,
        message: "Déconnexion réussie",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la déconnexion";
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
    user: User,
  ): Omit<User, "password" | "otpCode" | "otpExpiresAt"> {
    // Variables marquées comme non utilisées intentionnellement
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, otpCode, otpExpiresAt, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }
}
