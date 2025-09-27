"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
// Symboles pour l'injection de dépendances
exports.TYPES = {
    // Controllers
    UserController: Symbol.for("UserController"),
    AuthController: Symbol.for("AuthController"),
    ProfileController: Symbol.for("ProfileController"),
    // Services
    UserService: Symbol.for("UserService"),
    AuthService: Symbol.for("AuthService"),
    ProfileService: Symbol.for("ProfileService"),
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    // Middleware
    AuthMiddleware: Symbol.for("AuthMiddleware"),
    // Utils
    Logger: Symbol.for("Logger"),
    Config: Symbol.for("Config"),
};
//# sourceMappingURL=types.js.map