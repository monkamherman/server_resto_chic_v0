import type { Express, Request, Response, NextFunction } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { envs } from './core/config/env';
import { RequestHandler } from 'express';

// Configuration Swagger
export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Resto',
      version: '1.0.0',
      description: 'Documentation de l\'API Resto',
    },
    servers: [
      {
        url: `http://localhost:${envs.PORT}`,
        description: 'Environnement de développement local',
      },
      {
        url: 'https://server-resto-api.onrender.com',
        description: 'Environnement de production',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configuration des options Swagger UI
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
};

// Middleware pour gérer la documentation Swagger
export const setupSwagger = (app: Express): void => {
  // Configuration de la documentation Swagger UI
  const swaggerUiMiddleware: RequestHandler = (req, res, next) => {
    return setup(swaggerSpec, swaggerUiOptions)(req, res, next);
  };

  // Configuration des routes
  app.use('/api-docs', serve, swaggerUiMiddleware);

  // Redirection de la racine vers la documentation
  app.get('/', (req: Request, res: Response) => {
    res.redirect('/api-docs');
  });
};
