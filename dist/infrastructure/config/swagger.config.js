"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalResponses = exports.swaggerCustomOptions = exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentation de l\'API de l\'application')
    .setVersion('1.0')
    .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Entrez le token JWT',
    in: 'header',
}, 'JWT-auth')
    .addTag('Authentification')
    .addTag('Utilisateurs')
    // Ajoutez d'autres tags pour organiser votre documentation
    .build();
// Options personnalisées pour Swagger UI
exports.swaggerCustomOptions = {
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
exports.globalResponses = {
    '401': { description: 'Non autorisé' },
    '403': { description: 'Accès refusé' },
    '404': { description: 'Ressource non trouvée' },
    '429': { description: 'Trop de requêtes' },
    '500': { description: 'Erreur serveur' },
};
//# sourceMappingURL=swagger.config.js.map