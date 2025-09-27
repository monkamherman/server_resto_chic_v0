# Gestion des Utilisateurs

Ce module gère les fonctionnalités liées aux utilisateurs, y compris l'authentification, l'autorisation et la gestion des profils.

## Fonctionnalités

### Authentification
- **Inscription** : Création d'un nouveau compte utilisateur
- **Connexion** : Authentification avec email/numéro de téléphone et mot de passe
- **Rafraîchissement du token** : Renouvellement du token d'accès
- **Vérification OTP** : Validation des numéros de téléphone et emails
- **Réinitialisation du mot de passe** : Processus sécurisé de récupération de compte

### Gestion du Profil
- **Mise à jour du profil** : Modification des informations personnelles
- **Changement de mot de passe** : Mise à jour sécurisée du mot de passe
- **Désactivation de compte** : Désactivation temporaire ou permanente du compte

### Rôles et Permissions
- **Rôles prédéfinis** : ADMIN, USER, etc.
- **Gestion des accès** : Contrôle d'accès basé sur les rôles

## Modèle de Données

### Utilisateur (User)
- `id` : Identifiant unique
- `fullName` : Nom complet
- `email` : Adresse email (optionnel)
- `phoneNumber` : Numéro de téléphone
- `password` : Mot de passe haché
- `role` : Rôle de l'utilisateur (par défaut: USER)
- `isActive` : Statut d'activation du compte
- `createdAt` : Date de création
- `updatedAt` : Date de dernière mise à jour

## Sécurité

- Mots de passe hachés avec bcrypt
- JWT pour l'authentification
- Validation des entrées utilisateur
- Protection contre les attaques par force brute
- Expiration des tokens

## Points d'API Principaux

### Authentification
- `POST /auth/register` : Inscription d'un nouvel utilisateur
- `POST /auth/login` : Connexion
- `POST /auth/refresh` : Rafraîchissement du token
- `POST /auth/verify-otp` : Vérification OTP
- `POST /auth/forgot-password` : Demande de réinitialisation de mot de passe
- `POST /auth/reset-password` : Réinitialisation du mot de passe

### Utilisateurs
- `GET /users` : Liste des utilisateurs (admin)
- `GET /users/me` : Profil de l'utilisateur connecté
- `GET /users/:id` : Détails d'un utilisateur
- `PUT /users/:id` : Mise à jour d'un utilisateur
- `DELETE /users/:id` : Suppression d'un utilisateur (admin)

## Configuration

Les variables d'environnement suivantes doivent être configurées :

```env
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Tests

Pour exécuter les tests :

```bash
bun test
```
