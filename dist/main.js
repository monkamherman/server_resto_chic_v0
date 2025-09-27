"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const metrics_1 = require("./metrics/metrics");
// Fonction pour configurer les métriques
function setupMetrics(app) {
    // Initialiser les métriques
    (0, metrics_1.initMetrics)();
    // Endpoint de santé pour les vérifications de santé
    app.getHttpAdapter().get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Appliquer le middleware de métriques
    const metricsMiddleware = app.get('METRICS_MIDDLEWARE');
    app.use(metricsMiddleware.use.bind(metricsMiddleware));
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Configuration des métriques et de la santé
    setupMetrics(app);
    // Configuration de la validation globale
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Middleware de sécurité
    app.use(helmet_1.default);
    app.enableCors();
    app.use(compression_1.default);
    // Configuration de Swagger
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('Documentation de l\'API')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map