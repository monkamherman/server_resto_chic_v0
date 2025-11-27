import 'reflect-metadata';
import { app } from '../src/app';
import { createConnection, getConnection } from 'typeorm';
import { config } from 'dotenv';

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';

// Charger les variables d'environnement
config({ path: '.env.test' });

// Avant tous les tests, établir une connexion à la base de données
global.beforeAll(async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['src/infrastructure/database/entities/**/*.ts'],
      synchronize: true,
      dropSchema: true, // Attention : supprime toutes les données à chaque test
    });
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données de test :', error);
    throw error;
  }
});

// Après tous les tests, fermer la connexion à la base de données
global.afterAll(async () => {
  const connection = getConnection();
  if (connection.isConnected) {
    await connection.close();
  }
});
