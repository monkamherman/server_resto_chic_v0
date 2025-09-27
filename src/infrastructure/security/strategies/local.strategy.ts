import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../../../application/use-cases/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "identifier", // Permet d'utiliser soit l'email, soit le numéro de téléphone
      passwordField: "password",
    });
  }

  async validate(
    identifier: string,
    password: string,
  ): Promise<{
    id: string;
    email?: string;
    phoneNumber?: string;
    role: string;
  }> {
    // Vérifier si l'identifiant est un email ou un numéro de téléphone
    const isEmail = identifier.includes("@");

    let user;
    if (isEmail) {
      user = await this.authService.validateUserByEmail(identifier, password);
    } else {
      // Supprimer les caractères non numériques pour le numéro de téléphone
      const phoneNumber = identifier.replace(/\D/g, "");
      user = await this.authService.validateUserByPhone(phoneNumber, password);
    }

    if (!user) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    return user;
  }
}
