"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const combined_auth_guard_1 = require("./guards/combined-auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const pipes_module_1 = require("./pipes/pipes.module");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get("jwt.secret"),
                    signOptions: {
                        expiresIn: configService.get("jwt.expiresIn"),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule.forFeature(jwt_config_1.default),
            pipes_module_1.PipesModule,
        ],
        providers: [
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            {
                provide: core_1.APP_GUARD,
                useClass: combined_auth_guard_1.CombinedAuthGuard,
            },
        ],
        exports: [jwt_1.JwtModule, passport_1.PassportModule, pipes_module_1.PipesModule],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map