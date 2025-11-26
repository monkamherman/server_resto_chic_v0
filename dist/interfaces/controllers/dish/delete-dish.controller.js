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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDishController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dish_service_1 = require("../../../../domain/dish/services/dish.service");
let DeleteDishController = class DeleteDishController {
    dishService;
    constructor(dishService) {
        this.dishService = dishService;
    }
    async remove(id) {
        await this.dishService.remove(id);
    }
};
exports.DeleteDishController = DeleteDishController;
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a dish' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dish ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'The dish has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dish not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeleteDishController.prototype, "remove", null);
exports.DeleteDishController = DeleteDishController = __decorate([
    (0, swagger_1.ApiTags)('dishes'),
    (0, common_1.Controller)('dishes'),
    __metadata("design:paramtypes", [typeof (_a = typeof dish_service_1.DishService !== "undefined" && dish_service_1.DishService) === "function" ? _a : Object])
], DeleteDishController);
//# sourceMappingURL=delete-dish.controller.js.map