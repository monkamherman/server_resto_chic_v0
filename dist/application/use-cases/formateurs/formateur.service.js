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
exports.FormateurService = void 0;
const common_1 = require("@nestjs/common");
let FormateurService = class FormateurService {
    formateurRepository;
    constructor(formateurRepository) {
        this.formateurRepository = formateurRepository;
    }
    async create(createFormateurDto) {
        // Vérifier si un formateur avec cet email existe déjà
        const exists = await this.formateurRepository.exists(createFormateurDto.email);
        if (exists) {
            throw new common_1.ConflictException('Un formateur avec cet email existe déjà');
        }
        return this.formateurRepository.create(createFormateurDto);
    }
    async findAll(page = 1, limit = 10, search) {
        if (page < 1) {
            throw new common_1.BadRequestException('Le numéro de page doit être supérieur à 0');
        }
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('La limite doit être comprise entre 1 et 100');
        }
        return this.formateurRepository.findAll(page, limit, search);
    }
    async findOne(id) {
        const formateur = await this.formateurRepository.findOne(id);
        if (!formateur) {
            throw new common_1.NotFoundException(`Formateur avec l'ID "${id}" non trouvé`);
        }
        return formateur;
    }
    async update(id, updateFormateurDto) {
        // Vérifier si le formateur existe
        await this.findOne(id);
        // Vérifier si l'email est déjà utilisé par un autre formateur
        if (updateFormateurDto.email) {
            const exists = await this.formateurRepository.exists(updateFormateurDto.email, id);
            if (exists) {
                throw new common_1.ConflictException('Un formateur avec cet email existe déjà');
            }
        }
        return this.formateurRepository.update(id, updateFormateurDto);
    }
    async remove(id) {
        // Vérifier si le formateur existe
        await this.findOne(id);
        await this.formateurRepository.remove(id);
    }
    async findBySpecialite(specialite) {
        return this.formateurRepository.findBySpecialite(specialite);
    }
    async findByDisponibilite(disponibilite) {
        return this.formateurRepository.findByDisponibilite(disponibilite);
    }
};
exports.FormateurService = FormateurService;
exports.FormateurService = FormateurService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], FormateurService);
//# sourceMappingURL=formateur.service.js.map