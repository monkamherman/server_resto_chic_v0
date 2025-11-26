"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerOptions = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = require("swagger-ui-express");
const env_1 = require("./core/config/env");
// Configuration Swagger
exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Resto',
            version: '1.0.0',
            description: 'Documentation de l\'API Resto',
        },
        servers: [
            {
                url: `http://localhost:${env_1.envs.PORT}`,
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(exports.swaggerOptions);
// Configuration des options Swagger UI
const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
};
// Middleware pour gérer la documentation Swagger
const setupSwagger = (app) => {
    // Configuration de la documentation Swagger UI
    const swaggerUiMiddleware = (req, res, next) => {
        return (0, swagger_ui_express_1.setup)(swaggerSpec, swaggerUiOptions)(req, res, next);
    };
    // Configuration des routes
    app.use('/api-docs', swagger_ui_express_1.serve, swaggerUiMiddleware);
    // Redirection de la racine vers la documentation
    app.get('/', (req, res) => {
        res.redirect('/api-docs');
    });
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map