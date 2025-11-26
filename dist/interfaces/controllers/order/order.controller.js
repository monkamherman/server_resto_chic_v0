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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../../domain/order/services/order.service");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../../../infrastructure/security/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../infrastructure/security/decorators/roles.decorator");
const user_role_enum_1 = require("../../../domain/users/enums/user-role.enum");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(orderData) {
        const order = await this.orderService.create(orderData);
        return this.mapToOrderResponse(order);
    }
    async findAll() {
        const orders = await this.orderService.findAll();
        return orders.map(order => this.mapToOrderResponse(order));
    }
    async findOne(id) {
        const order = await this.orderService.findOne(id);
        if (!order) {
            throw new Error('Commande non trouvée');
        }
        return this.mapToOrderResponse(order);
    }
    async update(id, updateData) {
        const updatedOrder = await this.orderService.update(id, updateData);
        if (!updatedOrder) {
            throw new Error('Commande non trouvée');
        }
        return this.mapToOrderResponse(updatedOrder);
    }
    async remove(id) {
        const deleted = await this.orderService.remove(id);
        if (!deleted) {
            throw new Error('Commande non trouvée');
        }
        return { success: true };
    }
    mapToOrderResponse(order) {
        return {
            id: order.id,
            user_id: order.user_id,
            status: order.status,
            total_amount: Number(order.total_amount),
            coupon_code: order.coupon_code,
            discount_amount: Number(order.discount_amount),
            final_amount: Number(order.final_amount),
            created_at: order.created_at.toISOString(),
            updated_at: order.updated_at.toISOString(),
        };
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MODERATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MODERATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MODERATOR, user_role_enum_1.UserRole.USER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MODERATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "remove", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map