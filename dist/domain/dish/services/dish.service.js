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
exports.DishService = void 0;
const common_1 = require("@nestjs/common");
const IDishRepository_1 = require("../repositories/IDishRepository");
let DishService = class DishService {
    dishRepository;
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }
    async create(createDishDto) {
        // Vérifier si un plat avec le même nom existe déjà
        const dishExists = await this.dishRepository.exists(createDishDto.name);
        if (dishExists) {
            throw new common_1.ConflictException('Un plat avec ce nom existe déjà');
        }
        return this.dishRepository.create(createDishDto);
    }
    async findAll() {
        return this.dishRepository.findAll();
    }
    async findOne(id) {
        const dish = await this.dishRepository.findById(id);
        if (!dish) {
            throw new common_1.NotFoundException(`Plat avec l'ID "${id}" non trouvé`);
        }
        return dish;
    }
    async update(id, updateDishDto) {
        // Vérifier si le plat existe et le récupérer
        const existingDish = await this.findOne(id);
        // Si le nom est fourni et différent du nom actuel, vérifier qu'il n'est pas déjà utilisé
        if (updateDishDto.name && existingDish.name !== updateDishDto.name) {
            const nameExists = await this.dishRepository.exists(updateDishDto.name);
            if (nameExists) {
                throw new common_1.ConflictException('Un plat avec ce nom existe déjà');
            }
        }
        const updatedDish = await this.dishRepository.update(id, updateDishDto);
        if (!updatedDish) {
            throw new common_1.NotFoundException(`Impossible de mettre à jour le plat avec l'ID "${id}"`);
        }
        return updatedDish;
    }
    async remove(id) {
        // Vérifier si le plat existe
        await this.findOne(id);
        const deleted = await this.dishRepository.delete(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Impossible de supprimer le plat avec l'ID "${id}"`);
        }
    }
};
exports.DishService = DishService;
exports.DishService = DishService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], DishService);
//# sourceMappingURL=dish.service.js.map