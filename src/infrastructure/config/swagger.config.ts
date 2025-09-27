import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('Documentation de l\'API de l\'application')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Entrez le token JWT',
      in: 'header',
    },
    'JWT-auth', // Ce nom est utilisé dans le décorateur @ApiBearerAuth()
  )
  .addTag('Authentification')
  .addTag('Utilisateurs')
  // Ajoutez d'autres tags pour organiser votre documentation
  .build();

// Options personnalisées pour Swagger UI
export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  },
  customSiteTitle: 'API Documentation',
  useGlobalPrefix: false,
};

// Configuration pour les réponses globales
export const globalResponses = {
  '401': { description: 'Non autorisé' },
  '403': { description: 'Accès refusé' },
  '404': { description: 'Ressource non trouvée' },
  '429': { description: 'Trop de requêtes' },
  '500': { description: 'Erreur serveur' },
};
