"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const injection_types_1 = require("../shared/constants/injection.types");
const UserRepository_1 = require("../infrastructure/repositories/UserRepository");
const UserService_1 = require("../application/services/UserService");
const UserController_1 = require("../interfaces/controllers/UserController");
// Création du conteneur
const container = new inversify_1.Container();
exports.container = container;
// Enregistrement des dépendances
container.bind(injection_types_1.TYPES.UserRepository).to(UserRepository_1.UserRepository).inSingletonScope();
container.bind(injection_types_1.TYPES.UserService).to(UserService_1.UserService).inSingletonScope();
container.bind(injection_types_1.TYPES.UserController).to(UserController_1.UserController).inSingletonScope();
//# sourceMappingURL=container.js.map