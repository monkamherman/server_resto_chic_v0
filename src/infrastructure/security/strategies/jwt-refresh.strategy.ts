import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@application/use-cases/user/user.service';

type JwtRefreshPayload = {
  sub: string;
  refreshToken: string;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.refreshSecret"),
      passReqToCallback: true,
    });
  }

  async validate(
    req: { body: { refreshToken?: string } },
    payload: JwtRefreshPayload,
  ) {
    const refreshToken = req?.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token non fourni");
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Utilisateur non trouvé");
    }

    // Vérifier que le refresh token est valide (vous pourriez vouloir vérifier dans une liste de tokens révoqués)
    // Pour l'instant, on se contente de vérifier que l'utilisateur existe

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
