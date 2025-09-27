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
exports.ProfileService = void 0;
const inversify_1 = require("inversify");
const UserRepository_1 = require("@infrastructure/repositories/UserRepository");
const injection_types_1 = require("@shared/constants/injection.types");
let ProfileService = class ProfileService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return user;
    }
    async updateUserProfile(userId, updateData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        // Mettre à jour les champs autorisés
        const updatedUser = await this.userRepository.update(userId, updateData);
        return updatedUser;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        // Vérifier le mot de passe actuel
        const isPasswordValid = await this.userRepository.verifyPassword(userId, currentPassword);
        if (!isPasswordValid) {
            throw new Error("Mot de passe actuel incorrect");
        }
        // Mettre à jour le mot de passe
        await this.userRepository.updatePassword(userId, newPassword);
    }
    async updateProfilePicture(userId, filePath) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        // Mettre à jour la photo de profil
        const updatedUser = await this.userRepository.update(userId, {
            profilePicture: filePath,
        });
        return updatedUser;
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(injection_types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository])
], ProfileService);
//# sourceMappingURL=ProfileService.js.map