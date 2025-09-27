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
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const injection_types_1 = require("@shared/constants/injection.types");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Connecte un utilisateur
     */
    async login(req, res) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur lors de la connexion";
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
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
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
        }
        catch (error) {
            const errorMessage = error instanceof Error
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
    async logout(req, res) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error
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
    formatUserResponse(user) {
        // Variables marquées comme non utilisées intentionnellement
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, otpCode, otpExpiresAt, ...userWithoutSensitiveData } = user;
        return userWithoutSensitiveData;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/login"),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, inversify_express_utils_1.controller)("/auth"),
    __param(0, (0, inversify_1.inject)(injection_types_1.TYPES.AuthService)),
    __metadata("design:paramtypes", [Object])
], AuthController);
//# sourceMappingURL=AuthController.js.map