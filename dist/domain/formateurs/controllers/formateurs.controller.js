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
exports.FormateursController = void 0;
const common_1 = require("@nestjs/common");
const formateur_service_1 = require("../../../application/use-cases/formateurs/formateur.service");
const create_formateur_dto_1 = require("../dto/create-formateur.dto");
const update_formateur_dto_1 = require("../dto/update-formateur.dto");
const formateur_entity_1 = require("../entities/formateur.entity");
const swagger_1 = require("@nestjs/swagger");
let FormateursController = class FormateursController {
    formateurService;
    constructor(formateurService) {
        this.formateurService = formateurService;
    }
    async create(createFormateurDto) {
        try {
            return await this.formateurService.create(createFormateurDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du formateur';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(page = 1, limit = 10, search) {
        try {
            return await this.formateurService.findAll(page, limit, search);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des formateurs';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            return await this.formateurService.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(`Formateur avec l'ID "${id}" non trouvé`, common_1.HttpStatus.NOT_FOUND);
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du formateur';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateFormateurDto) {
        try {
            return await this.formateurService.update(id, updateFormateurDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(`Formateur avec l'ID "${id}" non trouvé`, common_1.HttpStatus.NOT_FOUND);
            }
            else if (error instanceof common_1.ConflictException) {
                throw new common_1.HttpException('Un formateur avec cet email existe déjà', common_1.HttpStatus.CONFLICT);
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du formateur';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.formateurService.remove(id);
            return { message: `Le formateur avec l'ID "${id}" a été supprimé avec succès` };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(`Formateur avec l'ID "${id}" non trouvé`, common_1.HttpStatus.NOT_FOUND);
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du formateur';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findBySpecialite(specialite) {
        try {
            return await this.formateurService.findBySpecialite(specialite);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la recherche par spécialité';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByDisponibilite(disponibilite) {
        try {
            return await this.formateurService.findByDisponibilite(disponibilite);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Une erreur est survenue lors de la recherche par disponibilité';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FormateursController = FormateursController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau formateur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Le formateur a été créé avec succès.', type: formateur_entity_1.Formateur }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Un formateur avec cet email existe déjà.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_formateur_dto_1.CreateFormateurDto]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les formateurs' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Numéro de page (par défaut: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page (par défaut: 10, max: 100)' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Terme de recherche' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des formateurs récupérée avec succès.', type: [formateur_entity_1.Formateur] }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un formateur par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du formateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le formateur a été trouvé.', type: formateur_entity_1.Formateur }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Formateur non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un formateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du formateur à mettre à jour' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le formateur a été mis à jour avec succès.', type: formateur_entity_1.Formateur }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Formateur non trouvé.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Un formateur avec cet email existe déjà.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_formateur_dto_1.UpdateFormateurDto]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un formateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du formateur à supprimer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le formateur a été supprimé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Formateur non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('specialite/:specialite'),
    (0, swagger_1.ApiOperation)({ summary: 'Trouver des formateurs par spécialité' }),
    (0, swagger_1.ApiParam)({ name: 'specialite', description: 'Spécialité à rechercher' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des formateurs trouvés.', type: [formateur_entity_1.Formateur] }),
    __param(0, (0, common_1.Param)('specialite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "findBySpecialite", null);
__decorate([
    (0, common_1.Get)('disponibilite/:disponibilite'),
    (0, swagger_1.ApiOperation)({ summary: 'Trouver des formateurs par disponibilité' }),
    (0, swagger_1.ApiParam)({ name: 'disponibilite', description: 'Disponibilité à rechercher' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des formateurs disponibles.', type: [formateur_entity_1.Formateur] }),
    __param(0, (0, common_1.Param)('disponibilite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormateursController.prototype, "findByDisponibilite", null);
exports.FormateursController = FormateursController = __decorate([
    (0, swagger_1.ApiTags)('formateurs'),
    (0, common_1.Controller)('formateurs'),
    __metadata("design:paramtypes", [formateur_service_1.FormateurService])
], FormateursController);
//# sourceMappingURL=formateurs.controller.js.map