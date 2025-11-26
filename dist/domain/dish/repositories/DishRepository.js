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
exports.PrismaDishRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("@infrastructure/persistence/prisma/prisma.service");
let PrismaDishRepository = class PrismaDishRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(prismaDish) {
        return {
            id: prismaDish.id,
            name: prismaDish.name,
            description: prismaDish.description || undefined,
            price: typeof prismaDish.price === 'string' ? parseFloat(prismaDish.price) : prismaDish.price,
            category: prismaDish.category,
            imageUrl: prismaDish.image_url || undefined,
            isAvailable: prismaDish.is_available,
            createdAt: prismaDish.created_at,
            updatedAt: prismaDish.updated_at,
        };
    }
    async create(data) {
        const createdDish = await this.prisma.dish.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                category: data.category,
                image_url: data.imageUrl,
                is_available: data.isAvailable,
            },
        });
        return this.toDomain(createdDish);
    }
    async findById(id) {
        const dish = await this.prisma.dish.findUnique({
            where: { id },
        });
        return dish ? this.toDomain(dish) : null;
    }
    async findAll() {
        const dishes = await this.prisma.dish.findMany({
            where: { is_available: true },
        });
        return dishes.map(dish => this.toDomain(dish));
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = parseFloat(data.price.toString());
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.imageUrl !== undefined)
            updateData.image_url = data.imageUrl;
        if (data.isAvailable !== undefined)
            updateData.is_available = data.isAvailable;
        const updatedDish = await this.prisma.dish.update({
            where: { id },
            data: updateData,
        });
        return updatedDish ? this.toDomain(updatedDish) : null;
    }
    async delete(id) {
        try {
            await this.prisma.dish.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async exists(name) {
        const count = await this.prisma.dish.count({
            where: { name },
        });
        return count > 0;
    }
    async findByCategory(category) {
        const dishes = await this.prisma.dish.findMany({
            where: {
                category,
                is_available: true
            },
        });
        return dishes.map(dish => this.toDomain(dish));
    }
};
exports.PrismaDishRepository = PrismaDishRepository;
exports.PrismaDishRepository = PrismaDishRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDishRepository);
//# sourceMappingURL=DishRepository.js.map