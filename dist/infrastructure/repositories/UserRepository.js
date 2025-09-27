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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
let UserRepository = class UserRepository {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(user) {
        return this.prisma.user.create({
            data: {
                fullName: user.fullName,
                email: user.email || null,
                phoneNumber: user.phoneNumber,
                password: user.password || null,
                role: user.role || "USER",
                nom: user.nom || null,
                prenom: user.prenom || null,
                sexe: user.sexe || null,
                otpVerified: false,
                isActive: false,
            },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findFirst({
            where: { email },
        });
    }
    async findByPhone(phoneNumber) {
        return this.prisma.user.findFirst({
            where: { phoneNumber },
        });
    }
    async update(id, userData) {
        // Filtrer les champs undefined pour éviter d'écraser des valeurs existantes
        const updateData = Object.fromEntries(Object.entries(userData).filter(([, value]) => value !== undefined));
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        const result = await this.prisma.user.delete({
            where: { id },
        });
        return !!result;
    }
    async verifyPassword(userId, password) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });
        if (!user || !user.password) {
            return false;
        }
        // Vérification du mot de passe avec bcrypt
        return bcrypt_1.default.compare(password, user.password);
    }
    async updatePassword(userId, newPassword) {
        // Hachage du nouveau mot de passe
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
    async createUserWithOtp(userData) {
        return this.prisma.user.create({
            data: {
                fullName: userData.fullName,
                phoneNumber: userData.phoneNumber,
                email: userData.email || null,
                nom: userData.nom || null,
                prenom: userData.prenom || null,
                sexe: userData.sexe || null,
                otpCode: userData.otpCode,
                otpExpiresAt: userData.otpExpiresAt,
                otpVerified: false,
                isActive: false,
                role: "USER", // Default role
            },
        });
    }
    async updateOtp(updateData) {
        const { phoneNumber, ...updateFields } = updateData;
        return this.prisma.user.update({
            where: { phoneNumber },
            data: updateFields,
        });
    }
    async completeRegistration(data) {
        return this.prisma.user.update({
            where: { id: data.userId },
            data: {
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
                otpVerified: true,
                isActive: true,
                otpCode: null,
                otpExpiresAt: null,
            },
        });
    }
    async findUserWithRole(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return null;
        return {
            ...user,
            role: user.role || "USER",
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
//# sourceMappingURL=UserRepository.js.map