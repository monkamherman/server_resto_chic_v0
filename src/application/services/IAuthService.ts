import { User } from "../../domain/entities/User";

export interface IAuthService {
  /**
   * Connecte un utilisateur avec son email et son mot de passe
   * @param email L'email de l'utilisateur
   * @param password Le mot de passe de l'utilisateur
   * @returns Un objet contenant l'utilisateur et le token JWT
   */
  login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string; refreshToken: string }>;

  /**
   * Rafraîchit le token d'authentification
   * @param refreshToken Le refresh token
   * @returns Un objet contenant le nouveau token et un nouveau refresh token
   */
  refreshToken(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string }>;

  /**
   * Déconnecte un utilisateur en invalidant son token
   * @param token Le token à invalider
   */
  logout(token: string): Promise<void>;
}
