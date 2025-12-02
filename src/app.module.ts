import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FormateursModule } from "./domain/formateurs/formateurs.module";
import { DishModule } from "./domain/dish/dish.module";
import { DishControllersModule } from "./interfaces/controllers/dish/dish-controllers.module";
import { OrderModule } from "./domain/order/order.module";
import { UsersModule } from "./domain/users/users.module";
import { ReviewModule } from "./domain/modules/review/review.module";
import { AdminModule } from "./domain/admin/admin.module";
import { RedisModule } from "./infrastructure/cache/redis.module";
import configuration from "./infrastructure/config/configuration";
import { PersistenceModule } from "./infrastructure/persistence/persistence.module";
import { PrismaModule } from "./infrastructure/persistence/prisma/prisma.module";
import { JwtAuthGuard } from "./infrastructure/security/guards/jwt-auth.guard";
import { RolesGuard } from "./infrastructure/security/guards/roles.guard";
import { SecurityModule } from "./infrastructure/security/security.module";
import { AuthModule } from "./interfaces/controllers/auth/auth.module";
import { UserModule } from "./interfaces/controllers/user/user.module";
import { MetricsModule } from "./metrics/metrics.module";
import { MetricsMiddleware } from "./middlewares/metrics.middleware";

@Module({
  imports: [
    // Configuration de l'application
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),

    // Protection contre les attaques par force brute
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute en millisecondes
        limit: 10, // 10 requêtes par minute
      },
    ]),

    // Persistence (Prisma)
    PersistenceModule,
    PrismaModule,

    // Modules de domaine
    OrderModule,
    UsersModule,
    DishModule,
    FormateursModule,
    ReviewModule,
    AdminModule,
    RedisModule,

    // Métriques de l'application
    MetricsModule,

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
    SecurityModule,
    UserModule,
    AuthModule,
    // Contrôleurs
    DishModule,
    DishControllersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: "METRICS_MIDDLEWARE",
      useClass: MetricsMiddleware,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
export class AppModule {}
