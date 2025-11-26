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
exports.CreateFormateurDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const STATUTS = ['DISPONIBLE', 'OCCUPE', 'INDISPONIBLE'];
class CreateFormateurDto {
    constructor(partial = {}) {
        Object.assign(this, {
            prenom: '',
            nom: '',
            email: '',
            specialites: [],
            disponibilites: [],
            statut: 'DISPONIBLE',
            ...partial
        });
    }
    prenom;
    nom;
    email;
    telephone;
    specialites;
    disponibilites;
    statut;
}
exports.CreateFormateurDto = CreateFormateurDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prénom du formateur', example: 'Jean' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormateurDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du formateur', example: 'Dupont' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormateurDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse email du formateur',
        example: 'jean.dupont@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateFormateurDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone du formateur',
        example: '+33123456789',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFormateurDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spécialités du formateur',
        example: ['JavaScript', 'TypeScript', 'NestJS'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFormateurDto.prototype, "specialites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Disponibilités du formateur',
        example: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFormateurDto.prototype, "disponibilites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut du formateur',
        example: 'DISPONIBLE',
        enum: STATUTS
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(STATUTS),
    __metadata("design:type", String)
], CreateFormateurDto.prototype, "statut", void 0);
//# sourceMappingURL=create-formateur.dto.js.map