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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
// Custom pipe pour valider les ObjectId de MongoDB
const user_service_1 = require("@application/use-cases/user/user.service");
const user_role_enum_1 = require("@domain/users/enums/user-role.enum");
const roles_decorator_1 = require("@infrastructure/security/decorators/roles.decorator");
const jwt_auth_guard_1 = require("@infrastructure/security/guards/jwt-auth.guard");
const parse_object_id_pipe_1 = require("@infrastructure/security/pipes/parse-object-id.pipe");
const create_user_dto_1 = require("@interfaces/controllers/user/dto/create-user.dto");
const update_user_dto_1 = require("@interfaces/controllers/user/dto/update-user.dto");
const user_response_dto_1 = require("@interfaces/controllers/user/dto/user-response.dto");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto) {
        const user = await this.userService.create(createUserDto);
        return user;
    }
    async findAll(isActive, role) {
        const users = await this.userService.findAll({ isActive, role });
        return users;
    }
    async getProfile(req) {
        const user = await this.userService.findById(req.user.userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return user;
    }
    async findOne(id) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return user;
    }
    async update(id, updateUserDto, req) {
        // Un utilisateur ne peut mettre à jour que son propre profil, sauf s'il est admin
        if (req.user.role !== user_role_enum_1.UserRole.ADMIN && req.user.userId !== id) {
            throw new Error("Non autorisé");
        }
        const user = await this.userService.update(id, updateUserDto);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return user;
    }
    async remove(id) {
        await this.userService.delete(id);
        return { message: "Utilisateur supprimé avec succès" };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: "Créer un nouvel utilisateur (Admin uniquement)" }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Utilisateur créé avec succès",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Accès refusé" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Données invalides",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Récupérer tous les utilisateurs (Admin uniquement)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "isActive",
        required: false,
        type: Boolean,
        description: "Filtrer par statut actif/inactif",
    }),
    (0, swagger_1.ApiQuery)({
        name: "role",
        required: false,
        enum: user_role_enum_1.UserRole,
        description: "Filtrer par rôle utilisateur",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Liste des utilisateurs",
        type: [user_response_dto_1.UserResponseDto],
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Accès refusé" }),
    __param(0, (0, common_1.Query)("isActive")),
    __param(1, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer le profil de l'utilisateur connecté" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Profil utilisateur",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Non autorisé" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Récupérer un utilisateur par son ID (Admin uniquement)",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Utilisateur trouvé",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Utilisateur non trouvé" }),
    __param(0, (0, common_1.Param)("id", parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({
        summary: "Mettre à jour un utilisateur",
        description: "Les utilisateurs ne peuvent mettre à jour que leur propre profil, les admins peuvent tout mettre à jour",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Utilisateur mis à jour avec succès",
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Accès refusé" }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Utilisateur non trouvé" }),
    __param(0, (0, common_1.Param)("id", parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Supprimer un utilisateur (Admin uniquement)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID de l'utilisateur à supprimer" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: "Utilisateur supprimé avec succès",
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Utilisateur non trouvé" }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Accès refusé" }),
    __param(0, (0, common_1.Param)("id", parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map