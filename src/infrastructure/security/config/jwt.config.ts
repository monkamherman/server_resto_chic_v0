import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'votre_secret_tres_securise',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // 1 jour d'expiration par défaut
  },
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'votre_refresh_secret_tres_securise',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // 7 jours pour le refresh token
}));
