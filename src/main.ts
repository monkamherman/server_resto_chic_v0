import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe, INestApplication } from "@nestjs/common";
import compression from "compression";
import helmet from "helmet";
import { initMetrics } from "./metrics/metrics";

// Fonction pour configurer les métriques
function setupMetrics(app: INestApplication) {
  // Initialiser les métriques
  initMetrics();

  // Endpoint de santé pour les vérifications de santé
  app.getHttpAdapter().get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Appliquer le middleware de métriques
  const metricsMiddleware = app.get("METRICS_MIDDLEWARE");
  app.use(metricsMiddleware.use.bind(metricsMiddleware));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration des métriques et de la santé
  setupMetrics(app);

  // Configuration de la validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Middleware de sécurité
  app.use(helmet);
  app.enableCors();
  app.use(compression);

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("Documentation de l'API")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
