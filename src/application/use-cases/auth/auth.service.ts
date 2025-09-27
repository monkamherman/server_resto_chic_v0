import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { LoginDto } from "@interfaces/controllers/auth/dto/login.dto";
import { RegisterDto } from "@interfaces/controllers/auth/dto/register.dto";
import { TokenResponseDto } from "@interfaces/controllers/auth/dto/token-response.dto";
import { User } from "../../../domain/entities/user.entity";
import { UserRole } from "../../../domain/users/enums/user-role.enum";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserByEmail(
    email: string,
    password: string,
  ): Promise<Omit<User, "password" | "otpCode" | "otpExpiresAt"> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await this.validatePassword(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, otpCode, otpExpiresAt, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByPhone(
    phoneNumber: string,
    password: string,
  ): Promise<Omit<User, "password" | "otpCode" | "otpExpiresAt"> | null> {
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (user && (await this.validatePassword(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, otpCode, otpExpiresAt, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    // Vérifier si l'identifiant est un email ou un numéro de téléphone
    const isEmail = loginDto.identifier.includes("@");
    let user: User | null = null;

    if (isEmail) {
      user = await this.userService.findByEmail(loginDto.identifier);
    } else {
      const phoneNumber = loginDto.identifier.replace(/\D/g, "");
      user = await this.userService.findByPhoneNumber(phoneNumber);
    }

    if (
      !user?.password ||
      !(await this.validatePassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Votre compte est désactivé");
    }

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const { email, phoneNumber, password } = registerDto;

    // Vérifier si l'email existe déjà
    if (email) {
      const existingUserByEmail = await this.userService.findByEmail(email);
      if (existingUserByEmail) {
        throw new ConflictException(
          "Un utilisateur avec cet email existe déjà",
        );
      }
    }

    // Vérifier si le numéro de téléphone existe déjà
    const existingUserByPhone =
      await this.userService.findByPhoneNumber(phoneNumber);
    if (existingUserByPhone) {
      throw new ConflictException(
        "Un utilisateur avec ce numéro de téléphone existe déjà",
      );
    }

    // Créer l'utilisateur
    const hashedPassword = await this.hashPassword(password);
    const userData: Omit<RegisterDto, "password"> & {
      password: string;
      isActive?: boolean;
      role?: UserRole;
    } = {
      ...registerDto,
      password: hashedPassword,
    };
    // Ne pas inclure isActive s'il n'est pas défini dans le DTO
    if (userData.isActive === undefined) {
      userData.isActive = true;
    }
    if (!userData.role) {
      userData.role = UserRole.USER;
    }

    const newUser = await this.userService.create(userData);

    // Générer les tokens
    return this.generateTokens(newUser);
  }

  async refreshTokens(
    userId: string,
    // Paramètre conservé pour compatibilité arrière mais non utilisé
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unusedRefreshToken = "",
  ): Promise<TokenResponseDto> {
    // Le paramètre _refreshToken est préfixé par un _ pour indiquer qu'il n'est pas utilisé
    // Vérifier que l'utilisateur existe

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Utilisateur non trouvé");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Votre compte est désactivé");
    }

    // Générer de nouveaux tokens
    return this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    // Dans une implémentation complète, on pourrait ajouter le token à une liste noire
    // ou supprimer le refresh token de la base de données
    // Implémentation de la déconnexion
    // Pourrait implémenter l'invalidation du token ici
    console.log(`User ${userId} logged out`);
  }

  async requestPasswordReset(identifier: string): Promise<void> {
    let user: User;

    if (identifier.includes("@")) {
      user = await this.userService.findByEmail(identifier);
    } else {
      const phoneNumber = identifier.replace(/\D/g, "");
      user = await this.userService.findByPhoneNumber(phoneNumber);
    }

    if (!user) {
      // Ne pas révéler que l'utilisateur n'existe pas pour des raisons de sécurité
      return;
    }

    // Générer un token de réinitialisation
    const resetToken = uuidv4();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // 1 heure d'expiration

    // Enregistrer le token dans la base de données
    await this.userService.update(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // Envoyer un email ou un SMS avec le lien de réinitialisation
    // Cette partie dépendra de votre fournisseur d'emails/SMS
    console.log(
      `Lien de réinitialisation: /reset-password?token=${resetToken}`,
    );
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<TokenResponseDto> {
    const user = await this.userService.findByResetToken(token);

    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new BadRequestException(
        "Token de réinitialisation invalide ou expiré",
      );
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await this.hashPassword(newPassword);

    // Créer un objet partiel avec uniquement les champs nécessaires
    const updateData: {
      password: string;
      resetToken?: null;
      resetTokenExpires?: null;
      otpCode?: null;
      otpExpiresAt?: null;
    } = {
      password: hashedPassword,
    };

    // Ajouter les champs optionnels s'ils existent
    if ("resetToken" in user) {
      updateData.resetToken = null;
    }
    if ("resetTokenExpires" in user) {
      updateData.resetTokenExpires = null;
    }

    await this.userService.update(user.id, updateData);

    // Connecter automatiquement l'utilisateur après la réinitialisation
    return this.generateTokens(user);
  }

  async verifyOtp(identifier: string, otpCode: string): Promise<boolean> {
    let user: User;

    if (identifier.includes("@")) {
      user = await this.userService.findByEmail(identifier);
    } else {
      const phoneNumber = identifier.replace(/\D/g, "");
      user = await this.userService.findByPhoneNumber(phoneNumber);
    }

    if (!user || !user.otpCode || user.otpCode !== otpCode) {
      return false;
    }

    // Vérifier si le code OTP a expiré
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return false;
    }

    // Marquer le code OTP comme vérifié
    const updateData: {
      otpCode: null;
      otpExpiresAt: null;
      otpVerified?: boolean;
    } = {
      otpCode: null,
      otpExpiresAt: null,
    };

    // Vérifier si la propriété otpVerified existe avant de la définir
    if ("otpVerified" in user) {
      updateData.otpVerified = true;
    }

    await this.userService.update(user.id, updateData);

    return true;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
    return user;
  }

  private async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.secret"),
        expiresIn: this.configService.get<string>("jwt.expiresIn"),
      }),
      this.jwtService.signAsync(
        { ...payload, refreshToken: true },
        {
          secret: this.configService.get<string>("jwt.refreshSecret"),
          expiresIn:
            this.configService.get<string>("jwt.refreshExpiresIn") || "7d",
        },
      ),
    ]);

    const expiresIn = this.configService.get<number>("jwt.expiresIn") ?? 3600; // Valeur par défaut 1h

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
