"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Ce doit être la première instruction
require("reflect-metadata");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const inversify_1 = require("inversify");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const inversify_express_utils_1 = require("inversify-express-utils");
const morgan_1 = __importDefault(require("morgan"));
// Import des services
const AuthService_1 = require("./application/services/AuthService");
const ProfileService_1 = require("./application/services/ProfileService");
const UserService_1 = require("./application/services/UserService");
const UserRepository_1 = require("./infrastructure/repositories/UserRepository");
const tokens_1 = require("./shared/constants/tokens");
// Import des contrôleurs (doit être fait après reflect-metadata)
require("./controllers");
// Création et configuration du conteneur Inversify
const container = new inversify_1.Container({ defaultScope: "Singleton" });
// Enregistrement des dépendances
container.bind(tokens_1.TYPES.UserRepository).to(UserRepository_1.UserRepository);
container.bind(tokens_1.TYPES.UserService).to(UserService_1.UserService);
container.bind(tokens_1.TYPES.ProfileService).to(ProfileService_1.ProfileService);
container.bind(tokens_1.TYPES.AuthService).to(AuthService_1.AuthService);
// Charge les décorateurs @provide
container.load((0, inversify_binding_decorators_1.buildProviderModule)());
// Les contrôleurs sont automatiquement liés par inversify-express-utils
// Configuration d'Inversify Express Server
const server = new inversify_express_utils_1.InversifyExpressServer(container, null, {
    rootPath: "/api", // Préfixe d'API global
}, null, null, false // Désactive le mode par défaut qui peut causer des problèmes
);
// Configuration des middlewares
server.setConfig((app) => {
    // Middleware pour parser le JSON
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Configuration CORS
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(new Error("Blocked by CORS policy"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    // Sécurité
    // Configuration de la sécurité avec Helmet
    app.use((0, helmet_1.default)());
    // Configuration CSP séparée pour un meilleur typage
    app.use(helmet_1.default.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://*"],
        },
    }));
    // Autres en-têtes de sécurité
    app.use(helmet_1.default.hsts({
        maxAge: 63072000, // 2 ans
        includeSubDomains: true,
        preload: true,
    }));
    // Configuration de sécurité avancée
    app.use(helmet_1.default.frameguard({ action: "deny" }));
    app.use(helmet_1.default.hidePoweredBy());
    app.use(helmet_1.default.noSniff());
    // Configuration simplifiée de la politique de référence
    app.use(helmet_1.default.referrerPolicy({
        policy: "strict-origin-when-cross-origin",
    }));
    // Compression
    app.use((0, compression_1.default)());
    // Logging
    if (process.env.NODE_ENV !== 'test') {
        // Utilisation d'une fonction wrapper typée explicitement
        const morganMiddleware = (0, morgan_1.default)("combined");
        app.use(morganMiddleware);
    }
    // Fichiers statiques
    app.use(express_1.default.static("public"));
});
// Configuration de la gestion des erreurs
server.setErrorConfig((app) => {
    // Gestion des erreurs 404
    app.use((_req, res) => {
        res.status(404).json({
            status: "error",
            message: "Ressource non trouvée",
        });
    });
    // Gestion des erreurs globales
    app.use((err, req, res) => {
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
            message: process.env.NODE_ENV === "production"
                ? "Une erreur est survenue"
                : err.message,
        });
    });
});
// Création de l'application Express
const app = server.build();
exports.app = app;
// Démarrer le serveur
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
// Démarrer le serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
    app
        .listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT} en mode ${NODE_ENV}`);
    })
        .on("error", (err) => {
        console.error("Erreur de démarrage du serveur:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=app.js.map