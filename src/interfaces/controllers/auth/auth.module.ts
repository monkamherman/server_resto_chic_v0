import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "../../../application/use-cases/auth/auth.service";
import { JwtStrategy } from "../../../infrastructure/security/strategies/jwt.strategy";
import { JwtRefreshStrategy } from "../../../infrastructure/security/strategies/jwt-refresh.strategy";
import { LocalStrategy } from "../../../infrastructure/security/strategies/local.strategy";
import { UserModule } from "../user/user.module";
import { SecurityModule } from "../../../infrastructure/security/security.module";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get('jwt');
        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.signOptions.expiresIn,
          },
        };
      },
    }),
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
