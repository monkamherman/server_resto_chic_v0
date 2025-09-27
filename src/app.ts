import "reflect-metadata";
import compression from "compression";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import morgan from "morgan";
import { UserService } from "./application/services/UserService";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { IUserRepository } from "./domain/repositories/IUserRepository";
import { ProfileService } from "./application/services/ProfileService";
import { IProfileService } from "./application/services/IProfileService";
import { AuthService } from "./application/services/AuthService";
import { IAuthService } from "./application/services/IAuthService";
import { TYPES } from "./shared/constants/injection.types";
import "./controllers"; // Import des contrôleurs pour l'enregistrement automatique

// Création du conteneur Inversify
const container = new Container();

// Enregistrement des dépendances
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container.bind(TYPES.UserService).to(UserService).inSingletonScope();
container
  .bind<IProfileService>(TYPES.ProfileService)
  .to(ProfileService)
  .inSingletonScope();
container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();
// Les contrôleurs sont automatiquement liés par inversify-express-utils

// Configuration d'Inversify Express Server
const server = new InversifyExpressServer(
  container,
  null,
  { rootPath: "/api" }, // Préfixe d'API global
);

// Configuration des middlewares
server.setConfig((app: Application) => {
  // Middleware pour parser le JSON
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuration CORS
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error("Blocked by CORS policy"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Sécurité
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          fontSrc: ["'self'"],
        },
      },
      hsts: {
        maxAge: 63072000, // 2 ans
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: "deny" },
      hidePoweredBy: true,
      noSniff: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xssFilter: true,
    }),
  );

  // Compression
  app.use(compression());

  // Logging
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
  }

  // Fichiers statiques
  app.use(express.static("public"));

  // Les routes sont gérées automatiquement par Inversify via les décorateurs @controller
});

// Configuration de la gestion des erreurs
server.setErrorConfig((app: Application) => {
  // Gestion des erreurs 404
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: "error",
      message: "Ressource non trouvée",
    });
  });

  // Gestion des erreurs globales
  app.use(
    (
      err: Error & {
        status?: number;
        cause?: Record<string, unknown> | string | undefined;
      },
      req: Request,
      res: Response,
    ) => {
      console.error("Erreur non gérée:", err);

      // Gestion des erreurs CORS
      if (err.message && err.message.includes("CORS")) {
        return res.status(403).json({
          status: "error",
          message: "Accès non autorisé",
        });
      }

      // Gestion des erreurs de validation
      if (err.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          message: "Erreur de validation des données",
          errors: err.cause || err.message,
        });
      }

      // Erreur JWT
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: "error",
          message: "Jeton d'authentification invalide",
        });
      }

      // Erreur par défaut
      res.status(500).json({
        status: "error",
        message:
          process.env.NODE_ENV === "production"
            ? "Une erreur est survenue"
            : err.message,
      });
    },
  );
});

// Création de l'application Express
const app = server.build();

// Démarrer le serveur
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Démarrer le serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
  app
    .listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT} en mode ${NODE_ENV}`);
    })
    .on("error", (err: Error) => {
      console.error("Erreur de démarrage du serveur:", err);
      process.exit(1);
    });
}

export { app };
