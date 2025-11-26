"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
// Tokens d'injection pour Inversify
exports.TYPES = {
    // Services
    AuthService: Symbol.for('AuthService'),
    UserService: Symbol.for('UserService'),
    ProfileService: Symbol.for('ProfileService'),
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    // Autres dépendances
    // ...
};
//# sourceMappingURL=tokens.js.map