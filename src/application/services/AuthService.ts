import { inject, injectable } from "inversify";
import { IAuthService } from "./IAuthService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { TYPES } from "@shared/constants/injection.types";

// Type pour la charge utile du token JWT
interface JwtPayload {
  userId: string;
  email?: string;
  role?: string;
}

@injectable()
export class AuthService implements IAuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly REFRESH_TOKEN_EXPIRES_IN: string;

  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {
    // TODO: Déplacer ces valeurs dans un fichier de configuration
    this.JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
    this.REFRESH_TOKEN_SECRET =
      process.env.REFRESH_TOKEN_SECRET || "votre_refresh_token_secret";
    this.REFRESH_TOKEN_EXPIRES_IN =
      process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Identifiants invalides");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      throw new Error("Identifiants invalides");
    }

    // Générer les tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Retourner les informations de l'utilisateur et les tokens
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        // Ajouter d'autres champs nécessaires
      } as User,
      token,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      // Vérifier le refresh token
      const payload = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as {
        userId: string;
      };

      // Récupérer l'utilisateur
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Générer de nouveaux tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Refresh token invalide");
    }
  }

  async logout(token: string): Promise<void> {
    // Implémentez ici la logique pour invalider le token
    // Par exemple, stocker le token dans une liste noire
    // Cette implémentation dépend de votre stratégie de gestion des tokens
    console.log(`Déconnexion de l'utilisateur avec le token: ${token}`);
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: parseInt(this.JWT_EXPIRES_IN, 10),
    });
  }

  private generateRefreshToken(user: User): string {
    const payload: JwtPayload = { userId: user.id };

    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: parseInt(this.REFRESH_TOKEN_EXPIRES_IN, 10),
    });
  }
}
