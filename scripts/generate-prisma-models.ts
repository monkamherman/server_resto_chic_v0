import { execSync } from 'child_process';
import * as path from 'path';

// Chemin vers le script de parsing du schéma
const scriptPath = path.join(__dirname, 'parse-prisma-schema.ts');

console.log('Génération des modèles Prisma...');

try {
  // Exécuter directement le script de parsing
  require(scriptPath);
  console.log('Modèles Prisma générés avec succès!');
  process.exit(0);
} catch (error) {
  console.error('Erreur lors de la génération des modèles Prisma:', error);
  process.exit(1);
}
