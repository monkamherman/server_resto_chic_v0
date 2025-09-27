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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../../../application/use-cases/user/user.service");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "jwt-refresh") {
    userService;
    configService;
    constructor(userService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("jwt.refreshSecret"),
            passReqToCallback: true,
        });
        this.userService = userService;
        this.configService = configService;
    }
    async validate(req, payload) {
        const refreshToken = req?.body?.refreshToken;
        if (!refreshToken) {
            throw new common_1.UnauthorizedException("Refresh token non fourni");
        }
        // Vérifier que l'utilisateur existe toujours
        const user = await this.userService.findById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException("Utilisateur non trouvé");
        }
        // Vérifier que le refresh token est valide (vous pourriez vouloir vérifier dans une liste de tokens révoqués)
        // Pour l'instant, on se contente de vérifier que l'utilisateur existe
        return {
            userId: payload.sub,
            refreshToken,
        };
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy;
exports.JwtRefreshStrategy = JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, config_1.ConfigService])
], JwtRefreshStrategy);
//# sourceMappingURL=jwt-refresh.strategy.js.map