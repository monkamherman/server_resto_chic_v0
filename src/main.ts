import 'reflect-metadata';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { initMetrics } from './metrics/metrics';

// Interface pour les erreurs personnalisées
interface AppError extends Error {
  status?: number;
  errors?: Record<string, unknown>;
  stack?: string;
}

// Création de l'application Express
const app = express();

// Configuration du port
const PORT = process.env.PORT || 3000;

// Création du serveur HTTP
const server: Server = createServer(app);

// Configuration CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || '*';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Configuration des middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression()); // Compression des réponses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialisation des métriques
initMetrics();

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
app.use((err: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  const address = server.address() as AddressInfo;
  console.log(`\n🚀 Serveur démarré sur http://localhost:${address.port}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Démarrage: ${new Date().toISOString()}\n`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason: unknown, promise) => {
  const reasonMessage = reason instanceof Error 
    ? reason.message 
    : typeof reason === 'object' && reason !== null && 'message' in reason
      ? String((reason as { message: unknown }).message)
      : String(reason);
      
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reasonMessage);
  // Optionnel : envoyer une notification ou logger dans un service externe
});

process.on('uncaughtException', (error: Error) => {
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

export { app };
