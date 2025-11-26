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
const prisma_service_1 = require("../../../../infrastructure/persistence/prisma/prisma.service");
const user_entity_1 = require("../../entities/user.entity");
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(prismaUser) {
        return new user_entity_1.User({
            id: prismaUser.id,
            username: prismaUser.phoneNumber, // On utilise phoneNumber comme identifiant unique
            email: prismaUser.email || undefined,
            password: prismaUser.password || undefined,
            firstName: prismaUser.prenom || undefined,
            lastName: prismaUser.nom || undefined,
            role: prismaUser.role,
            isActive: prismaUser.isActive,
            refreshToken: prismaUser.otpCode || undefined,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        });
    }
    async create(user) {
        const createdUser = await this.prisma.user.create({
            data: {
                fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
                nom: user.lastName,
                prenom: user.firstName,
                phoneNumber: user.username, // phoneNumber est l'identifiant unique
                email: user.email,
                password: user.password,
                role: user.role,
                isActive: user.isActive,
                otpCode: user.refreshToken,
            },
        });
        return this.toDomain(createdUser);
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(user => this.toDomain(user));
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user ? this.toDomain(user) : null;
    }
    async findByEmail(email) {
        if (!email)
            return null;
        const user = await this.prisma.user.findFirst({
            where: { email },
        });
        return user ? this.toDomain(user) : null;
    }
    async update(id, user) {
        const data = {
            fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
            nom: user.lastName,
            prenom: user.firstName,
            phoneNumber: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            isActive: user.isActive,
            otpCode: user.refreshToken,
            updatedAt: new Date(),
        };
        // Créer un nouvel objet sans les champs undefined
        const cleanData = {};
        if (data.fullName !== undefined)
            cleanData.fullName = data.fullName;
        if (data.nom !== undefined)
            cleanData.nom = data.nom;
        if (data.prenom !== undefined)
            cleanData.prenom = data.prenom;
        if (data.phoneNumber !== undefined)
            cleanData.phoneNumber = data.phoneNumber;
        if (data.email !== undefined)
            cleanData.email = data.email;
        if (data.password !== undefined)
            cleanData.password = data.password;
        if (data.role !== undefined)
            cleanData.role = data.role;
        if (data.isActive !== undefined)
            cleanData.isActive = data.isActive;
        if (data.otpCode !== undefined)
            cleanData.otpCode = data.otpCode;
        cleanData.updatedAt = data.updatedAt; // Toujours présent
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: cleanData,
        });
        return updatedUser ? this.toDomain(updatedUser) : null;
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async findByUsername(username) {
        // Dans notre schéma, le username est stocké dans phoneNumber
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phoneNumber: username },
                    { email: username }
                ]
            },
        });
        return user ? this.toDomain(user) : null;
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                otpCode: refreshToken,
                otpExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours d'expiration
            },
        });
    }
    async findByRefreshToken(refreshToken) {
        const user = await this.prisma.user.findFirst({
            where: {
                otpCode: refreshToken,
                otpExpiresAt: {
                    gt: new Date() // Vérifie que le token n'est pas expiré
                }
            },
        });
        return user ? this.toDomain(user) : null;
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map