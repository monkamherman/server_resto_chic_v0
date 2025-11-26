import { registerAs } from '@nestjs/config';

const validateJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

  if (!secret || secret === 'your_jwt_secret_key_here') {
    throw new Error('JWT_SECRET is not properly configured in environment variables');
  }

  if (!refreshSecret || refreshSecret === 'your_refresh_token_secret_here') {
    throw new Error('JWT_REFRESH_SECRET is not properly configured in environment variables');
  }

  return {
    secret,
    signOptions: {
      expiresIn: expiresIn || '15m', // 15 minutes par défaut pour le token d'accès
    },
    refreshSecret,
    refreshExpiresIn: refreshExpiresIn || '7d',
  };
};

export default registerAs('jwt', validateJwtConfig);
