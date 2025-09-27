"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_role_enum_1 = require("../../../domain/users/enums/user-role.enum");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    configService;
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUserByEmail(email, password) {
        const user = await this.userService.findByEmail(email);
        if (user && (await this.validatePassword(password, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, otpCode, otpExpiresAt, ...result } = user;
            return result;
        }
        return null;
    }
    async validateUserByPhone(phoneNumber, password) {
        const user = await this.userService.findByPhoneNumber(phoneNumber);
        if (user && (await this.validatePassword(password, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, otpCode, otpExpiresAt, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        // Vérifier si l'identifiant est un email ou un numéro de téléphone
        const isEmail = loginDto.identifier.includes("@");
        let user = null;
        if (isEmail) {
            user = await this.userService.findByEmail(loginDto.identifier);
        }
        else {
            const phoneNumber = loginDto.identifier.replace(/\D/g, "");
            user = await this.userService.findByPhoneNumber(phoneNumber);
        }
        if (!user?.password ||
            !(await this.validatePassword(loginDto.password, user.password))) {
            throw new common_1.UnauthorizedException("Identifiants invalides");
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException("Votre compte est désactivé");
        }
        return this.generateTokens(user);
    }
    async register(registerDto) {
        const { email, phoneNumber, password } = registerDto;
        // Vérifier si l'email existe déjà
        if (email) {
            const existingUserByEmail = await this.userService.findByEmail(email);
            if (existingUserByEmail) {
                throw new common_1.ConflictException("Un utilisateur avec cet email existe déjà");
            }
        }
        // Vérifier si le numéro de téléphone existe déjà
        const existingUserByPhone = await this.userService.findByPhoneNumber(phoneNumber);
        if (existingUserByPhone) {
            throw new common_1.ConflictException("Un utilisateur avec ce numéro de téléphone existe déjà");
        }
        // Créer l'utilisateur
        const hashedPassword = await this.hashPassword(password);
        const userData = {
            ...registerDto,
            password: hashedPassword,
        };
        // Ne pas inclure isActive s'il n'est pas défini dans le DTO
        if (userData.isActive === undefined) {
            userData.isActive = true;
        }
        if (!userData.role) {
            userData.role = user_role_enum_1.UserRole.USER;
        }
        const newUser = await this.userService.create(userData);
        // Générer les tokens
        return this.generateTokens(newUser);
    }
    async refreshTokens(userId, 
    // Paramètre conservé pour compatibilité arrière mais non utilisé
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unusedRefreshToken = "") {
        // Le paramètre _refreshToken est préfixé par un _ pour indiquer qu'il n'est pas utilisé
        // Vérifier que l'utilisateur existe
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("Utilisateur non trouvé");
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException("Votre compte est désactivé");
        }
        // Générer de nouveaux tokens
        return this.generateTokens(user);
    }
    async logout(userId) {
        // Dans une implémentation complète, on pourrait ajouter le token à une liste noire
        // ou supprimer le refresh token de la base de données
        // Implémentation de la déconnexion
        // Pourrait implémenter l'invalidation du token ici
        console.log(`User ${userId} logged out`);
    }
    async requestPasswordReset(identifier) {
        let user;
        if (identifier.includes("@")) {
            user = await this.userService.findByEmail(identifier);
        }
        else {
            const phoneNumber = identifier.replace(/\D/g, "");
            user = await this.userService.findByPhoneNumber(phoneNumber);
        }
        if (!user) {
            // Ne pas révéler que l'utilisateur n'existe pas pour des raisons de sécurité
            return;
        }
        // Générer un token de réinitialisation
        const resetToken = (0, uuid_1.v4)();
        const resetTokenExpires = new Date();
        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // 1 heure d'expiration
        // Enregistrer le token dans la base de données
        await this.userService.update(user.id, {
            resetToken,
            resetTokenExpires,
        });
        // Envoyer un email ou un SMS avec le lien de réinitialisation
        // Cette partie dépendra de votre fournisseur d'emails/SMS
        console.log(`Lien de réinitialisation: /reset-password?token=${resetToken}`);
    }
    async resetPassword(token, newPassword) {
        const user = await this.userService.findByResetToken(token);
        if (!user ||
            !user.resetTokenExpires ||
            user.resetTokenExpires < new Date()) {
            throw new common_1.BadRequestException("Token de réinitialisation invalide ou expiré");
        }
        // Mettre à jour le mot de passe
        const hashedPassword = await this.hashPassword(newPassword);
        // Créer un objet partiel avec uniquement les champs nécessaires
        const updateData = {
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
    async verifyOtp(identifier, otpCode) {
        let user;
        if (identifier.includes("@")) {
            user = await this.userService.findByEmail(identifier);
        }
        else {
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
        const updateData = {
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
    async getProfile(userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("Utilisateur non trouvé");
        }
        return user;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("jwt.secret"),
                expiresIn: this.configService.get("jwt.expiresIn"),
            }),
            this.jwtService.signAsync({ ...payload, refreshToken: true }, {
                secret: this.configService.get("jwt.refreshSecret"),
                expiresIn: this.configService.get("jwt.refreshExpiresIn") || "7d",
            }),
        ]);
        const expiresIn = this.configService.get("jwt.expiresIn") ?? 3600; // Valeur par défaut 1h
        return {
            accessToken,
            refreshToken,
            tokenType: "Bearer",
            expiresIn,
        };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async validatePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map