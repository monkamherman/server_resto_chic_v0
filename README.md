# Node.js Starter Template

Un template de démarrage complet pour les applications Node.js avec TypeScript, Express, Prisma, et bien plus encore.

## 🚀 Fonctionnalités

- **Runtime** : Node.js 20+
- **Langage** : TypeScript
- **Framework Web** : Express.js
- **Base de données** : Prisma ORM (PostgreSQL/MySQL/SQLite)
- **Validation** : Joi ou Zod
- **Authentification** : JWT
- **Documentation** : Swagger/OpenAPI
- **Linting** : ESLint + Prettier
- **Tests** : Jest
- **Gestion des commits** : Commitizen + Husky
- **Gestion des variables d'environnement** : dotenv
- **Logging** : Winston
- **Sécurité** : Helmet, rate limiting, CORS

## 🛠️ Prérequis

- Node.js 20 ou supérieur
- Yarn (recommandé) ou npm
- Base de données (PostgreSQL/MySQL/SQLite)
- Git

## 💻 Utilisation des commits conventionnels

Ce projet utilise Commitizen avec Husky pour assurer des messages de commit cohérents et bien formatés.

### Commandes disponibles :

- `yarn ac` ou `git ac`
  - Ajoute tous les fichiers modifiés
  - Lance l'interface de commit interactif
  - Crée un commit avec le message saisi

- `yarn acp` ou `git acp`
  - Fait tout ce que fait `yarn ac`
  - En plus, tire les mises à jour distantes
  - Pousse les changements vers le dépôt distant

- `yarn commit` ou `git cz`
  - Lance simplement l'interface de commit interactif

### Format des messages de commit :

Les messages de commit suivent la convention suivante :

```
<type>(<scope>): <description>

[corps du message]

[note de bas de page]
```

#### Types de commits :

- **feat**: Une nouvelle fonctionnalité
- **fix**: Une correction de bug
- **docs**: Changements dans la documentation
- **style**: Mise en forme, point-virgule manquant, etc.
- **refactor**: Changement de code qui ne corrige pas un bug ni n'ajoute une fonctionnalité
- **perf**: Changement de code qui améliore les performances
- **test**: Ajout de tests manquants
- **chore**: Mise à jour des tâches de construction, configuration du gestionnaire de paquets

#### Exemple :

```
feat(api): ajouter l'endpoint de création d'utilisateur

Ajoute un nouvel endpoint POST /api/users pour la création d'utilisateur avec validation des données.

Closes #123
```

## 🛠️ Génération de code avec Plop

Ce projet utilise [Plop.js](https://plopjs.com/) pour générer automatiquement du code cohérent et bien structuré. Plop permet de créer rapidement des composants, contrôleurs, services, etc. avec une structure standardisée.

### Commandes disponibles :

- **Générer un nouveau domaine complet**

  ```bash
  bun generate domain
  ```

  Crée une structure complète pour un nouveau domaine (modèle, contrôleur, service, repository, DTOs, tests).

- **Générer un contrôleur**

  ```bash
  bun generate controller
  ```

  Crée un nouveau contrôleur avec la documentation Swagger intégrée.

- **Générer un repository**

  ```bash
  bun generate repository
  ```

  Crée une interface de repository et son implémentation.

- **Générer des tests avec vérification Swagger**
  ```bash
  bun generate swagger-test
  ```
  Crée des tests qui vérifient automatiquement la cohérence entre l'API et sa documentation Swagger.

### Fonctionnalités des générateurs :

- **Génération de code conforme aux bonnes pratiques**
- **Documentation Swagger automatique**
- **Tests unitaires pré-configurés**
- **Structure de dossiers cohérente**
- **Validation des entrées**

### Exemple d'utilisation :

1. **Créer un nouveau domaine**

   ```bash
   bun generate domain
   ```

   Répondez aux questions pour générer la structure complète.

2. **Créer un contrôleur personnalisé**

   ```bash
   bun generate controller
   ```

   Suivez les invites pour générer un contrôleur avec les actions CRUD.

3. **Générer des tests Swagger**
   ```bash
   bun generate swagger-test
   ```
   Crée des tests qui vérifient que votre API est correctement documentée.

## 🚀 Installation

1. **Cloner le dépôt**

   ```bash
   git clone git@github.com:monkamherman/node-starter.git
   cd node-starter
   ```

2. **Installer les dépendances**

   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Configurer l'environnement**

   ```bash
   cp .env.example .env
   # Puis éditer le fichier .env avec vos configurations
   ```

4. **Configurer la base de données**

   ```bash
   # Générer le client Prisma
   yarn prisma generate

   # Appliquer les migrations
   yarn prisma migrate dev
   ```

5. **Démarrer l'application**

   ```bash
   # Mode développement
   yarn dev

   # Mode production
   yarn build
   yarn start
   ```

## 🧪 Exécuter les tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm test:watch

# Générer un rapport de couverture
npm run test:coverage
```

## 🛠️ Commandes utiles

- `yarn dev` - Démarrer le serveur en mode développement avec rechargement à chaud
- `yarn build` - Compiler le code TypeScript
- `yarn start` - Démarrer le serveur en production
- `yarn lint` - Linter le code
- `yarn format` - Formater le code avec Prettier
- `yarn prisma:studio` - Lancer Prisma Studio pour la gestion de la base de données

## 🏗️ Structure du projet

```
├── src/
│   ├── config/         # Configurations de l'application
│   ├── controllers/    # Contrôleurs
│   ├── interfaces/     # Interfaces TypeScript
│   ├── middlewares/    # Middlewares Express
│   ├── models/         # Modèles de données
│   ├── routes/         # Définition des routes
│   ├── services/       # Logique métier
│   ├── utils/          # Utilitaires
│   ├── app.ts          # Configuration d'Express
│   └── server.ts       # Point d'entrée du serveur
├── prisma/            # Schémas et migrations Prisma
├── tests/             # Tests
├── .env.example       # Exemple de variables d'environnement
└── package.json       # Dépendances et scripts
```

## 🔒 Sécurité

Ce template inclut plusieurs mesures de sécurité par défaut :

- Headers de sécurité avec Helmet
- Protection contre les attaques par force brute
- Validation des entrées
- Gestion sécurisée des mots de passe avec bcrypt
- Gestion des CORS

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- Et tous les autres contributeurs open source
