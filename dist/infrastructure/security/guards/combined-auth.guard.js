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
exports.CombinedAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const roles_guard_1 = require("./roles.guard");
let CombinedAuthGuard = class CombinedAuthGuard extends (0, passport_1.AuthGuard)("jwt") {
    reflector;
    jwtAuthGuard;
    rolesGuard;
    constructor(reflector, jwtAuthGuard, rolesGuard) {
        super();
        this.reflector = reflector;
        this.jwtAuthGuard = jwtAuthGuard;
        this.rolesGuard = rolesGuard;
    }
    async canActivate(context) {
        // Vérifie d'abord l'authentification JWT
        const canActivateJwt = await this.jwtAuthGuard.canActivate(context);
        if (!canActivateJwt) {
            return false;
        }
        // Ensuite vérifie les rôles
        const canActivateRoles = await this.rolesGuard.canActivate(context);
        if (!canActivateRoles) {
            return false;
        }
        return true;
    }
};
exports.CombinedAuthGuard = CombinedAuthGuard;
exports.CombinedAuthGuard = CombinedAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_auth_guard_1.JwtAuthGuard,
        roles_guard_1.RolesGuard])
], CombinedAuthGuard);
//# sourceMappingURL=combined-auth.guard.js.map