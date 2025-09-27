import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../application/services/user.service';
import { User } from '../../../domain/entities/user.entity';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Ajoutez des validations supplémentaires si nécessaire
    // par exemple, vérifier si le compte est actif
    if (!user.isActive) {
      throw new Error('Ce compte est désactivé');
    }

    return user;
  }
}
