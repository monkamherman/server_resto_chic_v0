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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(prismaUser) {
        if (!prismaUser)
            return null;
        return {
            id: prismaUser.id,
            fullName: prismaUser.fullName,
            phoneNumber: prismaUser.phoneNumber,
            email: prismaUser.email,
            password: prismaUser.password,
            role: prismaUser.role,
            nom: prismaUser.nom ?? undefined,
            prenom: prismaUser.prenom ?? undefined,
            sexe: prismaUser.sexe ?? undefined,
            otpCode: prismaUser.otpCode ?? undefined,
            otpExpiresAt: prismaUser.otpExpiresAt ?? undefined,
            otpVerified: prismaUser.otpVerified,
            otpSentAt: prismaUser.otpSentAt ?? undefined,
            isActive: prismaUser.isActive,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        };
    }
    async create(userInput) {
        // Créer un nouvel utilisateur avec les propriétés requises
        const createdUser = await this.prisma.user.create({
            data: {
                fullName: userInput.fullName,
                phoneNumber: userInput.phoneNumber,
                isActive: userInput.isActive ?? false,
                role: userInput.role ?? "USER",
                nom: userInput.nom ?? null,
                prenom: userInput.prenom ?? null,
                sexe: userInput.sexe ?? null,
                email: userInput.email ?? null,
                password: userInput.password ?? null,
                otpCode: "otpCode" in userInput ? userInput.otpCode : null,
                otpExpiresAt: "otpExpiresAt" in userInput ? userInput.otpExpiresAt : null,
                otpVerified: "otpVerified" in userInput ? userInput.otpVerified : false,
                otpSentAt: "otpSentAt" in userInput ? userInput.otpSentAt : null,
            },
        });
        const domainUser = this.toDomain(createdUser);
        if (!domainUser) {
            throw new Error("Failed to create user");
        }
        return domainUser;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return this.toDomain(user);
    }
    async findByPhoneNumber(phoneNumber) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber },
        });
        return this.toDomain(user);
    }
    async update(id, data) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
            });
            const domainUser = this.toDomain(updatedUser);
            if (!domainUser) {
                throw new Error("User not found after update");
            }
            return domainUser;
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Unknown error occurred while updating user";
            throw new Error(`Failed to update user: ${errorMessage}`);
        }
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({ where: { id } });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async findByPhone(phoneNumber) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber },
        });
        return this.toDomain(user);
    }
    async createUserWithOtp(userData) {
        return this.create({
            ...userData,
            otpVerified: false,
            otpSentAt: new Date(),
            isActive: false,
        });
    }
    async updateOtp(updateData) {
        const { phoneNumber, ...updateFields } = updateData;
        const updatedUser = await this.prisma.user.update({
            where: { phoneNumber },
            data: updateFields,
        });
        const domainUser = this.toDomain(updatedUser);
        if (!domainUser) {
            throw new Error("User not found");
        }
        return domainUser;
    }
    async verifyPassword(userId, password) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });
        if (!user || !user.password) {
            return false;
        }
        // Ici, vous devriez utiliser une bibliothèque de hachage comme bcrypt
        return user.password === password; // À remplacer par une vérification sécurisée
    }
    async updatePassword(userId, newPassword) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
    }
    async completeRegistration(data) {
        return this.update(data.userId, {
            email: data.email,
            password: data.password,
            isActive: true,
            otpVerified: true,
        });
    }
    async findUserWithRole(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return null;
        }
        const domainUser = this.toDomain(user);
        if (!domainUser) {
            return null;
        }
        return {
            ...domainUser,
            role: user.role,
        };
    }
    async findByOtpCode(otpCode) {
        const user = await this.prisma.user.findFirst({
            where: { otpCode },
        });
        return this.toDomain(user);
    }
    async updateOtpInfo(id, data) {
        await this.prisma.user.update({
            where: { id },
            data: {
                otpCode: data.otpCode,
                otpExpiresAt: data.otpExpiresAt,
                otpSentAt: data.otpSentAt,
                updatedAt: new Date(),
            },
        });
    }
    async existsByEmail(email) {
        const count = await this.prisma.user.count({
            where: { email },
        });
        return count > 0;
    }
    async existsByPhoneNumber(phoneNumber) {
        const count = await this.prisma.user.count({
            where: { phoneNumber },
        });
        return count > 0;
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map