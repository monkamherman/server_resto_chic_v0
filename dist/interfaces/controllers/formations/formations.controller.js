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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationsController = void 0;
const common_1 = require("@nestjs/common");
const formations_service_1 = require("../../../domain/formations/services/formations.service");
const create_formation_dto_1 = require("../../../domain/formations/dtos/create-formation.dto");
const update_formation_dto_1 = require("../../../domain/formations/dtos/update-formation.dto");
const jwt_auth_guard_1 = require("../../../infrastructure/security/guards/jwt-auth.guard");
let FormationsController = class FormationsController {
    formationsService;
    constructor(formationsService) {
        this.formationsService = formationsService;
    }
    create(createFormationDto) {
        return this.formationsService.create(createFormationDto);
    }
    findAll() {
        return this.formationsService.findAll();
    }
    findOne(id) {
        return this.formationsService.findOne(id);
    }
    update(id, updateFormationDto) {
        return this.formationsService.update(id, updateFormationDto);
    }
    remove(id) {
        return this.formationsService.remove(id);
    }
};
exports.FormationsController = FormationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_formation_dto_1.CreateFormationDto !== "undefined" && create_formation_dto_1.CreateFormationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], FormationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_formation_dto_1.UpdateFormationDto !== "undefined" && update_formation_dto_1.UpdateFormationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], FormationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormationsController.prototype, "remove", null);
exports.FormationsController = FormationsController = __decorate([
    (0, common_1.Controller)('formations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof formations_service_1.FormationsService !== "undefined" && formations_service_1.FormationsService) === "function" ? _a : Object])
], FormationsController);
//# sourceMappingURL=formations.controller.js.map