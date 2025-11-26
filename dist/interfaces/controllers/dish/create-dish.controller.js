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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDishController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dish_service_1 = require("../../../../domain/dish/services/dish.service");
const create_dish_dto_1 = require("../../../../domain/dish/dtos/create-dish.dto");
const dish_entity_1 = require("../../../../domain/dish/entities/dish.entity");
let CreateDishController = class CreateDishController {
    dishService;
    constructor(dishService) {
        this.dishService = dishService;
    }
    async create(createDishDto) {
        return this.dishService.create(createDishDto);
    }
};
exports.CreateDishController = CreateDishController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new dish' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The dish has been successfully created.', type: dish_entity_1.Dish }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Dish with this name already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_dish_dto_1.CreateDishDto !== "undefined" && create_dish_dto_1.CreateDishDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CreateDishController.prototype, "create", null);
exports.CreateDishController = CreateDishController = __decorate([
    (0, swagger_1.ApiTags)('dishes'),
    (0, common_1.Controller)('dishes'),
    __metadata("design:paramtypes", [typeof (_a = typeof dish_service_1.DishService !== "undefined" && dish_service_1.DishService) === "function" ? _a : Object])
], CreateDishController);
//# sourceMappingURL=create-dish.controller.js.map