"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormateursModule = void 0;
const common_1 = require("@nestjs/common");
const formateurs_controller_1 = require("./controllers/formateurs.controller");
const formateur_service_1 = require("../../application/use-cases/formateurs/formateur.service");
const prisma_formateur_repository_1 = require("./repositories/prisma/prisma-formateur.repository");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
let FormateursModule = class FormateursModule {
};
exports.FormateursModule = FormateursModule;
exports.FormateursModule = FormateursModule = __decorate([
    (0, common_1.Module)({
        controllers: [formateurs_controller_1.FormateursController], // Ajout du contrôleur
        providers: [
            formateur_service_1.FormateurService,
            {
                provide: 'IFormateurRepository',
                useClass: prisma_formateur_repository_1.PrismaFormateurRepository,
            },
            prisma_service_1.PrismaService,
        ],
        exports: [formateur_service_1.FormateurService],
    })
], FormateursModule);
//# sourceMappingURL=formateurs.module.js.map