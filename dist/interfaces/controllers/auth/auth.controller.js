"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const local_auth_guard_1 = require("../../../infrastructure/security/guards/local-auth.guard");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../../../application/use-cases/auth/auth.service");
const public_decorator_1 = require("../../../infrastructure/security/decorators/public.decorator");
const jwt_auth_guard_1 = require("../../../infrastructure/security/guards/jwt-auth.guard");
const refresh_token_guard_1 = require("../../../infrastructure/security/guards/refresh-token.guard");
const login_dto_1 = require("./dto/login.dto");
const user_response_dto_1 = require("../user/dto/user-response.dto");
const register_dto_1 = require("./dto/register.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const token_response_dto_1 = require("./dto/token-response.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, res) {
        try {
            const tokens = await this.authService.login(loginDto);
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            });
            return tokens;
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue";
            throw new common_1.UnauthorizedException(`Échec de la connexion : ${errorMessage}`);
        }
    }
    async register(registerDto) {
        try {
            return await this.authService.register(registerDto);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("existe déjà")) {
                    throw new common_1.BadRequestException("Un utilisateur avec cet email ou ce numéro existe déjà");
                }
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException("Une erreur inconnue est survenue lors de l'inscription");
        }
    }
    async refreshTokens(req) {
        if (!req.user ||
            typeof req.user !== "object" ||
            !("sub" in req.user) ||
            !("refreshToken" in req.user)) {
            throw new common_1.UnauthorizedException("Token de rafraîchissement invalide");
        }
        const userId = String(req.user.sub);
        const refreshToken = String(req.user.refreshToken);
        if (!userId || !refreshToken) {
            throw new common_1.UnauthorizedException("Token de rafraîchissement invalide");
        }
        return this.authService.refreshTokens(userId, refreshToken);
    }
    async logout(req) {
        try {
            if (!req.user || typeof req.user !== "object" || !("sub" in req.user)) {
                throw new common_1.UnauthorizedException("Utilisateur non authentifié");
            }
            const userId = String(req.user.sub);
            await this.authService.logout(userId);
            return { message: "Déconnexion réussie" };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Échec de la déconnexion";
            throw new common_1.BadRequestException(errorMessage);
        }
    }
    async forgotPassword(forgotPasswordDto) {
        try {
            await this.authService.requestPasswordReset(forgotPasswordDto.identifier);
            return { message: "Un code de réinitialisation a été envoyé" };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException("Une erreur inconnue est survenue lors de la réinitialisation du mot de passe");
        }
    }
    async resetPassword(resetPasswordDto) {
        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
            throw new common_1.BadRequestException("Les mots de passe ne correspondent pas");
        }
        try {
            return await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException("Une erreur inconnue est survenue lors de la réinitialisation du mot de passe");
        }
    }
    async verifyOtp(verifyOtpDto) {
        try {
            const isValid = await this.authService.verifyOtp(verifyOtpDto.identifier, verifyOtpDto.otpCode);
            if (!isValid) {
                throw new common_1.BadRequestException("Code OTP invalide ou expiré");
            }
            return { message: "Code OTP vérifié avec succès" };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Échec de la vérification OTP";
            throw new common_1.BadRequestException(errorMessage);
        }
    }
    async getProfile(req) {
        try {
            if (!req.user || typeof req.user !== "object" || !("sub" in req.user)) {
                throw new common_1.UnauthorizedException("Utilisateur non authentifié");
            }
            const userId = String(req.user.sub);
            const user = await this.authService.getProfile(userId);
            return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user, {
                excludeExtraneousValues: true,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Impossible de récupérer le profil";
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException(errorMessage);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Connexion utilisateur" }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiOkResponse)({
        description: "Connexion réussie",
        type: token_response_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Identifiants invalides ou compte désactivé",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: "Inscription utilisateur" }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Inscription réussie",
        type: token_response_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Données invalides" }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Utilisateur déjà existant" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Post)("refresh-tokens"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Rafraîchir les tokens d'accès et de rafraîchissement",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Tokens rafraîchis avec succès",
        type: token_response_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Refresh token invalide ou expiré" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Déconnexion utilisateur" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Déconnexion réussie" }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Non autorisé" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("forgot-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Demande de réinitialisation de mot de passe" }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Un code de réinitialisation a été envoyé",
        type: Object,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Identifiant invalide" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("reset-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Réinitialiser le mot de passe" }),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Mot de passe réinitialisé avec succès",
        type: token_response_dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Token ou mot de passe invalide" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("verify-otp"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Vérifier un code OTP" }),
    (0, swagger_1.ApiBody)({ type: verify_otp_dto_1.VerifyOtpDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Code OTP vérifié avec succès",
        type: Object,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Code OTP invalide ou expiré" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer le profil utilisateur" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Profil utilisateur récupéré avec succès",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Non autorisé" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map