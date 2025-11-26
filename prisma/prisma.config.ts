import { defineConfig } from '@prisma/internals';

export default defineConfig({
  // Configuration pour la connexion directe à la base de données
  direct: {
    // Utilisation de l'URL de la base de données depuis les variables d'environnement
    url: process.env.DATABASE_URL,
  },
  // Configuration pour Prisma Accelerate (optionnel)
  accelerate: {
    url: process.env.PRISMA_ACCELERATE_URL,
  },
});
