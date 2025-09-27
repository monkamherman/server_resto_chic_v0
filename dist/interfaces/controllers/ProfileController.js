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
exports.ProfileController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const injection_types_1 = require("@shared/constants/injection.types");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    /**
     * Récupère le profil de l'utilisateur connecté
     */
    async getProfile(req, res) {
        try {
            const authUser = req.user;
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
        }
        catch (error) {
            const errorMessage = error instanceof Error
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
    async updateProfile(req, res) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Non autorisé",
                });
                return;
            }
            const userId = user.id;
            const updateData = req.body;
            const updatedUser = await this.profileService.updateUserProfile(userId, updateData);
            res.status(200).json({
                success: true,
                message: "Profil mis à jour avec succès",
                data: this.formatUserResponse(updatedUser),
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
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
    async changePassword(req, res) {
        try {
            const user = req.user;
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
                    message: "Le mot de passe actuel et le nouveau mot de passe sont requis",
                });
                return;
            }
            await this.profileService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json({
                success: true,
                message: "Mot de passe modifié avec succès",
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
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
    async updateProfilePicture(req, res) {
        try {
            const user = req.user;
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
            const file = req.file;
            if (!file) {
                res.status(400).json({
                    success: false,
                    message: "Erreur lors du traitement du fichier",
                });
                return;
            }
            const filePath = file.path;
            const updatedUser = await this.profileService.updateProfilePicture(userId, filePath);
            res.status(200).json({
                success: true,
                message: "Photo de profil mise à jour avec succès",
                data: this.formatUserResponse(updatedUser),
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
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
    formatUserResponse(user) {
        if (!user)
            return null;
        // Variables marquées comme non utilisées intentionnellement
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, otpCode, otpExpiresAt, ...userWithoutSensitiveData } = user;
        return userWithoutSensitiveData;
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, inversify_express_utils_1.httpGet)("/"),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/change-password"),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changePassword", null);
exports.ProfileController = ProfileController = __decorate([
    (0, inversify_express_utils_1.controller)("/profile"),
    __param(0, (0, inversify_1.inject)(injection_types_1.TYPES.ProfileService)),
    __metadata("design:paramtypes", [Object])
], ProfileController);
//# sourceMappingURL=ProfileController.js.map