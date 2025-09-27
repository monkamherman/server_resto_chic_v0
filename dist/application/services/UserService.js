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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const inversify_1 = require("inversify");
const injection_types_1 = require("../../shared/constants/injection.types");
const bcrypt_1 = __importDefault(require("bcrypt"));
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(userData) {
        // Vérifier si l'utilisateur existe déjà
        if (!userData.email) {
            throw new Error("L'email est obligatoire pour créer un utilisateur");
        }
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Un utilisateur avec cet email existe déjà");
        }
        // Hasher le mot de passe
        const hashedPassword = userData.password
            ? await bcrypt_1.default.hash(userData.password, 10)
            : undefined;
        // Créer l'utilisateur
        return this.userRepository.create({
            ...userData,
            password: hashedPassword || "",
        });
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async getUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    /**
     * Trouve un utilisateur par son numéro de téléphone
     * @param phoneNumber Le numéro de téléphone à rechercher
     * @returns L'utilisateur correspondant ou null si non trouvé
     */
    async getUserByPhone(phoneNumber) {
        return this.userRepository.findByPhone(phoneNumber);
    }
    async updateUser(id, userData) {
        // Si le mot de passe est fourni, le hasher
        if (userData.password) {
            userData.password = await bcrypt_1.default.hash(userData.password, 10);
        }
        // Mise à jour de l'utilisateur
        const updatedUser = await this.userRepository.update(id, userData);
        if (!updatedUser) {
            throw new Error("Échec de la mise à jour de l'utilisateur");
        }
        return updatedUser;
    }
    async deleteUser(id) {
        return this.userRepository.delete(id);
    }
    async registerWithOtp(userData) {
        return this.userRepository.createUserWithOtp(userData);
    }
    async verifyOtp(phoneNumber, otpCode) {
        const user = await this.userRepository.findByPhone(phoneNumber);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        if (user.otpCode !== otpCode) {
            throw new Error("Code OTP invalide");
        }
        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            throw new Error("Le code OTP a expiré");
        }
        // Mise à jour de l'OTP avec les valeurs correctes
        return this.userRepository.updateOtp({
            phoneNumber,
            otpVerified: true,
            otpCode: undefined, // Utiliser undefined au lieu de null pour éviter les problèmes de typage
            otpExpiresAt: undefined,
            otpSentAt: undefined,
        });
    }
    async completeRegistration(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        return this.userRepository.completeRegistration({
            ...data,
            password: hashedPassword,
        });
    }
    async resendOtp(phoneNumber, otpCode) {
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 30);
        return this.userRepository.updateOtp({
            phoneNumber,
            otpCode,
            otpExpiresAt,
            otpVerified: false,
            otpSentAt: new Date(),
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(injection_types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=UserService.js.map