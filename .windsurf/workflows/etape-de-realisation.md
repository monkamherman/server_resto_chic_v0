---
description: etape pour la realisation d'une app  restaurant moderne : découverte → réservation → commande → paiement → fidélisation → feedback.
auto_execution_mode: 1
---

# PROJET BACKEND RESTAURANT - ARCHITECTURE & IMPLÉMENTATION

## CONTEXTE

Je développe une application backend complète pour un restaurant avec les spécifications suivantes :

**Stack technique imposée :**

- Framework : Express.js avec TypeScript
- Base de données : MongoDB (principal) + Redis (cache/sessions)
- ORM : Prisma
- DI : Inversify
- Notifications : WebPush

**Fonctionnalités métier (déduites du schema) :**

- Gestion utilisateurs et authentification
- Catalogue de plats et menu
- Système de commandes et réservations
- Programme de fidélité et récompenses
- Système de promotions et coupons
- Avis et notations
- Logs de sécurité et monitoring

## MISSION

Agis comme un architecte logiciel senior et développeur full-stack. Guide-moi dans l'implémentation complète de ce backend avec les bonnes pratiques et l'architecture la plus adaptée.

## ARCHITECTURE DEMANDÉE

### 1. STRUCTURE DU PROJET

continuer avec la structure existante.

### 2. COUCHES À IMPLÉMENTER

- **Domain Layer** : Entities pure business logic
- **Application Layer** : Use cases et services applicatifs
- **Infrastructure Layer** : Repositories, external services
- **Presentation Layer** : REST API, WebPush handlers

### 3. SPÉCIFICITÉS TECHNIQUES

#### 🔐 AUTHENTIFICATION & SÉCURITÉ

- JWT avec refresh tokens
- Rate limiting avec Redis
- Protection brute force (login_attempts)
- Blacklist emails
- Security logs audit trail

#### 🗄️ PERSISTANCE AVEC PRISMA

- Schema Prisma optimisé pour MongoDB
- Relations et indexes appropriés
- Transactions pour les opérations critiques
- Migrations et seeding

#### 🔄 CACHING & PERFORMANCE

- Redis pour :
  - Cache des menus et plats populaires
  - Sessions utilisateurs
  - Rate limiting
  - Queue pour notifications

#### 📱 NOTIFICATIONS WEBPUSH

- Service de notifications push pour :
  - Confirmations de commande
  - Rappels de réservation
  - Promotions personnalisées
  - Statut des commandes
- Gestion des subscriptions VAPID

#### 📊 API DESIGN

- RESTful avec versioning
- Documentation OpenAPI/Swagger
- Pagination, filtering, sorting
- Validation des inputs avec class-validator
- Error handling standardisé

## TÂCHES DÉTAILLÉES

### PHASE 1: SETUP & CONFIGURATION

1. **Initialisation projet** : Express + TypeScript + ESLint + Prettier
2. **Configuration Inversify** : Container et bindings
3. **Setup Prisma** : Schema MongoDB, génération client
4. **Configuration Redis** : Connection, services de cache
5. **WebPush** : Génération keys VAPID, service de notifications

### PHASE 2: DOMAIN CORE

1. **Entities** : User, Dish, Order, Reservation, Coupon, Review, Loyalty
2. **Value Objects** : Email, Price, Rating, etc.
3. **Domain Services** : LoyaltyCalculator, OrderValidator, etc.
4. **Repository Interfaces** (ports)

### PHASE 3: INFRASTRUCTURE

1. **Repositories MongoDB** avec Prisma
2. **Services Redis** : Cache, Session, RateLimit
3. **WebPush Service** : Subscription management, notification sending
4. **External Services** : Email, SMS (si besoin)

### PHASE 4: APPLICATION LAYER

1. **Use Cases** pour chaque fonctionnalité métier
2. **Application Services** orchestration
3. **DTOs** et Mappers
4. **Event Handlers** pour le domain events

### PHASE 5: PRESENTATION LAYER

1. **Controllers** REST avec error handling
2. **Middlewares** : Auth, Validation, Logging
3. **WebPush Controllers** : subscription, notification
4. **Documentation** OpenAPI

### PHASE 6: SÉCURITÉ & MONITORING

1. **JWT Strategy** avec refresh tokens
2. **Rate Limiting** global et par endpoint
3. **Security Middlewares** : CORS, Helmet, etc.
4. **Logging** structuré avec Winston
5. **Health checks**

## EXIGENCES SPÉCIFIQUES

### POUR CHAQUE COMPOSANT :

- ✅ Interface TypeScript
- ✅ Implementation concrète
- ✅ Tests unitaires (Jest)
- ✅ Injection de dépendances
- ✅ Error handling spécifique
- ✅ Logging approprié

### POUR LA BASE DE DONNÉES :

- ✅ Schema Prisma optimisé MongoDB
- ✅ Indexes pour les requêtes fréquentes
- ✅ Relations bien définies
- ✅ Migrations reproductibles

### POUR LES NOTIFICATIONS :

- ✅ Service WebPush robuste
- ✅ Gestion des subscriptions
- ✅ Templates de notifications
- ✅ Retry mechanism

## LIVRABLES ATTENDUS

Pour chaque étape, fournis :

1. **Code source** complet et fonctionnel
2. **Configuration** des outils
3. **Instructions** d'installation et déploiement
4. **Exemples** d'utilisation
5. **Tests** automatisés

## note bien

-le projet dois etre fortement commenter en francais
-a chaque etape le projet avoir les test unitaire et d'integration

Ensuite, guide-moi étape par étape dans l'implémentation complète.
