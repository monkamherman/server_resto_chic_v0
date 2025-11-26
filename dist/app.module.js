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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const configuration_1 = __importDefault(require("./infrastructure/config/configuration"));
const persistence_module_1 = require("./infrastructure/persistence/persistence.module");
const jwt_auth_guard_1 = require("./infrastructure/security/guards/jwt-auth.guard");
const roles_guard_1 = require("./infrastructure/security/guards/roles.guard");
const security_module_1 = require("./infrastructure/security/security.module");
const auth_module_1 = require("./interfaces/controllers/auth/auth.module");
const user_module_1 = require("./interfaces/controllers/user/user.module");
const metrics_module_1 = require("./metrics/metrics.module");
const metrics_middleware_1 = require("./middlewares/metrics.middleware");
const order_module_1 = require("./domain/order/order.module");
const prisma_module_1 = require("./infrastructure/persistence/prisma/prisma.module");
const users_module_1 = require("./domain/users/users.module");
const dish_module_1 = require("./domain/dish/dish.module");
const formateurs_module_1 = require("./domain/formateurs/formateurs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Configuration de l'application
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
            }),
            // Protection contre les attaques par force brute
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000, // 1 minute en millisecondes
                    limit: 10, // 10 requêtes par minute
                },
            ]),
            // Persistence (Prisma)
            persistence_module_1.PersistenceModule,
            prisma_module_1.PrismaModule,
            // Modules de domaine
            order_module_1.OrderModule,
            users_module_1.UsersModule,
            dish_module_1.DishModule,
            formateurs_module_1.FormateursModule,
            // Métriques de l'application
            metrics_module_1.MetricsModule,
            // Base de données
            // TypeOrmModule.forRootAsync({
            //   imports: [ConfigModule],
            //   useFactory: (configService: ConfigService) => ({
            //     type: "postgres",
            //     host: configService.get<string>("database.host"),
            //     port: configService.get<number>("database.port"),
            //     username: configService.get<string>("database.username"),
            //     password: configService.get<string>("database.password"),
            //     database: configService.get<string>("database.name"),
            //     entities: [__dirname + "/**/*.entity{.ts,.js}"],
            //     synchronize: process.env.NODE_ENV !== "production",
            //     logging: process.env.NODE_ENV !== "production",
            //   }),
            //   inject: [ConfigService],
            // }),
            // Modules de l'application
            security_module_1.SecurityModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: "METRICS_MIDDLEWARE",
                useClass: metrics_middleware_1.MetricsMiddleware,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            // // Filtre d'exception global pour Sentry
            // {
            //   provide: APP_FILTER,
            //   useClass: SentryFilter,
            // },
            // // Intercepteur global pour Sentry
            // {
            //   provide: APP_INTERCEPTOR,
            //   useClass: SentryInterceptor,
            // },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map