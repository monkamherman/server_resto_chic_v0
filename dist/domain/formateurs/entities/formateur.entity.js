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
exports.Formateur = void 0;
const swagger_1 = require("@nestjs/swagger");
class Formateur {
    id;
    prenom;
    nom;
    email;
    telephone;
    specialites;
    disponibilites;
    statut;
    createdAt;
    updatedAt;
    constructor(partial = {}) {
        this.id = partial.id || '';
        this.prenom = partial.prenom || '';
        this.nom = partial.nom || '';
        this.email = partial.email || '';
        this.telephone = partial.telephone || '';
        this.specialites = partial.specialites || [];
        this.disponibilites = partial.disponibilites || [];
        this.statut = partial.statut || 'DISPONIBLE';
        this.createdAt = partial.createdAt || new Date();
        this.updatedAt = partial.updatedAt || new Date();
    }
}
exports.Formateur = Formateur;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID unique du formateur' }),
    __metadata("design:type", String)
], Formateur.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prénom du formateur', example: 'Jean' }),
    __metadata("design:type", String)
], Formateur.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du formateur', example: 'Dupont' }),
    __metadata("design:type", String)
], Formateur.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse email du formateur',
        example: 'jean.dupont@example.com'
    }),
    __metadata("design:type", String)
], Formateur.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone du formateur',
        example: '+33123456789',
        required: false
    }),
    __metadata("design:type", String)
], Formateur.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spécialités du formateur',
        example: ['JavaScript', 'TypeScript', 'NestJS'],
        type: [String]
    }),
    __metadata("design:type", Array)
], Formateur.prototype, "specialites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Disponibilités du formateur',
        example: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
        type: [String]
    }),
    __metadata("design:type", Array)
], Formateur.prototype, "disponibilites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut du formateur',
        example: 'DISPONIBLE',
        enum: ['DISPONIBLE', 'OCCUPE', 'INDISPONIBLE']
    }),
    __metadata("design:type", String)
], Formateur.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de création du formateur',
        type: Date,
        required: false
    }),
    __metadata("design:type", Date)
], Formateur.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de dernière mise à jour',
        type: Date,
        required: false
    }),
    __metadata("design:type", Date)
], Formateur.prototype, "updatedAt", void 0);
//# sourceMappingURL=formateur.entity.js.map