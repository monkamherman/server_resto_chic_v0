"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
// Symboles d'injection
exports.TYPES = {
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    // Services
    UserService: Symbol.for("UserService"),
    AuthService: Symbol.for("AuthService"),
    ProfileService: Symbol.for("ProfileService"),
    // Controllers
    UserController: Symbol.for("UserController"),
    AuthController: Symbol.for("AuthController"),
    ProfileController: Symbol.for("ProfileController"),
    // Middlewares
    AuthMiddleware: Symbol.for("AuthMiddleware"),
    ErrorMiddleware: Symbol.for("ErrorMiddleware"),
    // Utils
    Logger: Symbol.for("Logger"),
    Config: Symbol.for("Config"),
};
//# sourceMappingURL=injection.types.js.map