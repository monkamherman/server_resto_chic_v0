import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  UnauthorizedException,
  Request as ReqDecorator,
  Response as ResDecorator,
} from "@nestjs/common";
import { LocalAuthGuard } from "../../../infrastructure/security/guards/local-auth.guard";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";

import { AuthService } from "../../../application/use-cases/auth/auth.service";
import { Public } from "../../../infrastructure/security/decorators/public.decorator";
import { JwtAuthGuard } from "../../../infrastructure/security/guards/jwt-auth.guard";
import { RefreshTokenGuard } from "../../../infrastructure/security/guards/refresh-token.guard";
import { LoginDto } from "./dto/login.dto";
import { UserResponseDto } from "../user/dto/user-response.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { TokenResponseDto } from "./dto/token-response.dto";

@ApiTags("auth")
@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Connexion utilisateur" })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: "Connexion réussie",
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Identifiants invalides ou compte désactivé",
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @ResDecorator({ passthrough: true }) res: Response,
  ): Promise<TokenResponseDto> {
    try {
      const tokens = await this.authService.login(loginDto);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });
      return tokens;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";
      throw new UnauthorizedException(
        `Échec de la connexion : ${errorMessage}`,
      );
    }
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Inscription utilisateur" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Inscription réussie",
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: "Données invalides" })
  @ApiForbiddenResponse({ description: "Utilisateur déjà existant" })
  async register(@Body() registerDto: RegisterDto): Promise<TokenResponseDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("existe déjà")) {
          throw new BadRequestException(
            "Un utilisateur avec cet email ou ce numéro existe déjà",
          );
        }
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        "Une erreur inconnue est survenue lors de l'inscription",
      );
    }
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh-tokens")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Rafraîchir les tokens d'accès et de rafraîchissement",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Tokens rafraîchis avec succès",
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Refresh token invalide ou expiré" })
  async refreshTokens(@ReqDecorator() req: Request): Promise<TokenResponseDto> {
    if (
      !req.user ||
      typeof req.user !== "object" ||
      !("sub" in req.user) ||
      !("refreshToken" in req.user)
    ) {
      throw new UnauthorizedException("Token de rafraîchissement invalide");
    }

    const userId = String(req.user.sub);
    const refreshToken = String(req.user.refreshToken);

    if (!userId || !refreshToken) {
      throw new UnauthorizedException("Token de rafraîchissement invalide");
    }

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Déconnexion utilisateur" })
  @ApiResponse({ status: HttpStatus.OK, description: "Déconnexion réussie" })
  @ApiUnauthorizedResponse({ description: "Non autorisé" })
  async logout(@ReqDecorator() req: Request): Promise<{ message: string }> {
    try {
      if (!req.user || typeof req.user !== "object" || !("sub" in req.user)) {
        throw new UnauthorizedException("Utilisateur non authentifié");
      }
      const userId = String(req.user.sub);
      await this.authService.logout(userId);
      return { message: "Déconnexion réussie" };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Échec de la déconnexion";
      throw new BadRequestException(errorMessage);
    }
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Demande de réinitialisation de mot de passe" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Un code de réinitialisation a été envoyé",
    type: Object,
  })
  @ApiBadRequestResponse({ description: "Identifiant invalide" })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.requestPasswordReset(forgotPasswordDto.identifier);
      return { message: "Un code de réinitialisation a été envoyé" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        "Une erreur inconnue est survenue lors de la réinitialisation du mot de passe",
      );
    }
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Réinitialiser le mot de passe" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Mot de passe réinitialisé avec succès",
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: "Token ou mot de passe invalide" })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<TokenResponseDto> {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new BadRequestException("Les mots de passe ne correspondent pas");
    }

    try {
      return await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        "Une erreur inconnue est survenue lors de la réinitialisation du mot de passe",
      );
    }
  }

  @Public()
  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Vérifier un code OTP" })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Code OTP vérifié avec succès",
    type: Object,
  })
  @ApiBadRequestResponse({ description: "Code OTP invalide ou expiré" })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    try {
      const isValid = await this.authService.verifyOtp(
        verifyOtpDto.identifier,
        verifyOtpDto.otpCode,
      );

      if (!isValid) {
        throw new BadRequestException("Code OTP invalide ou expiré");
      }

      return { message: "Code OTP vérifié avec succès" };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Échec de la vérification OTP";
      throw new BadRequestException(errorMessage);
    }
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Récupérer le profil utilisateur" })
  @ApiOkResponse({
    description: "Profil utilisateur récupéré avec succès",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Non autorisé" })
  async getProfile(@ReqDecorator() req: Request): Promise<UserResponseDto> {
    try {
      if (!req.user || typeof req.user !== "object" || !("sub" in req.user)) {
        throw new UnauthorizedException("Utilisateur non authentifié");
      }

      const userId = String(req.user.sub);
      const user = await this.authService.getProfile(userId);
      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Impossible de récupérer le profil";
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(errorMessage);
    }
  }
}
