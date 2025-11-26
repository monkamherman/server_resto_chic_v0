"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const metrics_1 = require("./metrics/metrics");
// Création de l'application Express
const app = (0, express_1.default)();
exports.app = app;
// Configuration du port
const PORT = process.env.PORT || 3000;
// Création du serveur HTTP
const server = (0, http_1.createServer)(app);
// Configuration CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || '*';
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
// Configuration des middlewares
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)()); // Compression des réponses
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Initialisation des métriques
(0, metrics_1.initMetrics)();
// Route de base
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Bienvenue sur l\'API du restaurant',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error('Erreur:', err.stack || err);
    // Gestion des erreurs de validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Erreur de validation des données',
            errors: err.errors || err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
    // Erreur JWT
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Jeton d\'authentification invalide ou expiré'
        });
    }
    // Erreur par défaut
    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Une erreur est survenue sur le serveur'
            : err.message,
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack
        })
    });
});
// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route non trouvée',
        path: req.path
    });
});
// Démarrer le serveur
server.listen(PORT, () => {
    const address = server.address();
    console.log(`\n🚀 Serveur démarré sur http://localhost:${address.port}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Démarrage: ${new Date().toISOString()}\n`);
});
// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    const reasonMessage = reason instanceof Error
        ? reason.message
        : typeof reason === 'object' && reason !== null && 'message' in reason
            ? String(reason.message)
            : String(reason);
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reasonMessage);
    // Optionnel : envoyer une notification ou logger dans un service externe
});
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    // Donner le temps aux logs d'être écrits
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});
// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
    console.log('\n🛑 Réception du signal SIGTERM. Arrêt en cours...');
    server.close(() => {
        console.log('✅ Serveur arrêté avec succès');
        process.exit(0);
    });
});
//# sourceMappingURL=main.js.map