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
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_role_enum_1 = require("../../../../domain/users/enums/user-role.enum");
class RegisterDto {
    fullName;
    phoneNumber;
    email;
    password;
    role;
    nom;
    prenom;
    sexe;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nom complet de l'utilisateur",
        example: "Jean Dupont",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le nom complet est requis" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Numéro de téléphone",
        example: "+33612345678",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le numéro de téléphone est requis" }),
    (0, class_validator_1.IsPhoneNumber)('FR', { message: "Numéro de téléphone français invalide" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Adresse email",
        example: "jean.dupont@example.com",
        required: false,
    }),
    (0, class_validator_1.IsEmail)({}, { message: "Email invalide" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Mot de passe",
        minLength: 6,
        example: "MotDePasse123!",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le mot de passe est requis" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères",
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Rôle de l'utilisateur",
        enum: user_role_enum_1.UserRole,
        default: user_role_enum_1.UserRole.USER,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(user_role_enum_1.UserRole, { message: "Rôle utilisateur invalide" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nom de famille",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Prénom",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Genre",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "sexe", void 0);
//# sourceMappingURL=register.dto.js.map