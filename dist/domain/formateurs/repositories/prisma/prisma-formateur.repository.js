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
exports.PrismaFormateurRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../infrastructure/persistence/prisma/prisma.service");
const formateur_entity_1 = require("../../entities/formateur.entity");
let PrismaFormateurRepository = class PrismaFormateurRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(formateur) {
        return new formateur_entity_1.Formateur({
            id: formateur.id,
            prenom: formateur.prenom,
            nom: formateur.nom,
            email: formateur.email,
            telephone: formateur.telephone,
            specialites: formateur.specialites,
            disponibilites: formateur.disponibilites,
            statut: formateur.statut,
            createdAt: formateur.createdAt,
            updatedAt: formateur.updatedAt,
        });
    }
    async create(createFormateurDto) {
        const formateur = await this.prisma.formateur.create({
            data: {
                ...createFormateurDto,
                specialites: {
                    set: createFormateurDto.specialites || [],
                },
                disponibilites: {
                    set: createFormateurDto.disponibilites || [],
                },
            },
        });
        return this.toDomain(formateur);
    }
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { prenom: { contains: search, mode: 'insensitive' } },
                    { nom: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [total, items] = await Promise.all([
            this.prisma.formateur.count({ where }),
            this.prisma.formateur.findMany({
                where,
                skip,
                take: limit,
                orderBy: { nom: 'asc' },
            }),
        ]);
        return {
            data: items.map((item) => this.toDomain(item)),
            total,
        };
    }
    async findOne(id) {
        const formateur = await this.prisma.formateur.findUnique({
            where: { id },
        });
        return formateur ? this.toDomain(formateur) : null;
    }
    async update(id, updateFormateurDto) {
        const { specialitesToAdd, specialitesToRemove, disponibilitesToAdd, disponibilitesToRemove, ...data } = updateFormateurDto;
        const updateData = { ...data };
        if (specialitesToAdd || specialitesToRemove) {
            updateData.specialites = {
                push: specialitesToAdd || [],
                set: specialitesToRemove
                    ? {
                        set: (await this.findOne(id))?.specialites.filter((s) => !specialitesToRemove.includes(s)),
                    }
                    : undefined,
            };
        }
        if (disponibilitesToAdd || disponibilitesToRemove) {
            updateData.disponibilites = {
                push: disponibilitesToAdd || [],
                set: disponibilitesToRemove
                    ? {
                        set: (await this.findOne(id))?.disponibilites.filter((d) => !disponibilitesToRemove.includes(d)),
                    }
                    : undefined,
            };
        }
        const updatedFormateur = await this.prisma.formateur.update({
            where: { id },
            data: updateData,
        });
        return this.toDomain(updatedFormateur);
    }
    async remove(id) {
        await this.prisma.formateur.delete({
            where: { id },
        });
    }
    async exists(email, excludeId) {
        const count = await this.prisma.formateur.count({
            where: {
                email,
                ...(excludeId && { id: { not: excludeId } }),
            },
        });
        return count > 0;
    }
    async findBySpecialite(specialite) {
        const formateurs = await this.prisma.formateur.findMany({
            where: {
                specialites: {
                    hasSome: [specialite],
                },
            },
        });
        return formateurs.map((f) => this.toDomain(f));
    }
    async findByDisponibilite(disponibilite) {
        const formateurs = await this.prisma.formateur.findMany({
            where: {
                disponibilites: {
                    hasSome: [disponibilite],
                },
            },
        });
        return formateurs.map((f) => this.toDomain(f));
    }
};
exports.PrismaFormateurRepository = PrismaFormateurRepository;
exports.PrismaFormateurRepository = PrismaFormateurRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaFormateurRepository);
//# sourceMappingURL=prisma-formateur.repository.js.map