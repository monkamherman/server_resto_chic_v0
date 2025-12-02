# API de Modération des Avis

Ce document décrit les endpoints disponibles pour la modération des avis côté administration.

## Base URL
```
/api/v1/admin/reviews
```

## Authentification
Toutes les requêtes doivent inclure un token JWT valide dans le header `Authorization`.

## Endpoints

### 1. Lister les avis (avec pagination et filtres)

**URL** : `GET /admin/reviews`

**Paramètres de requête** :
- `page` (optionnel, par défaut: 1) - Numéro de la page
- `limit` (optionnel, par défaut: 10) - Nombre d'éléments par page
- `status` (optionnel) - Filtre par statut : `pending`, `approved`, ou `rejected`

**Réponse en cas de succès (200 OK)** :
```json
{
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "dish_id": "string",
      "rating": 5,
      "comment": "string",
      "is_approved": true,
      "is_rejected": false,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "dish": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Approuver un avis

**URL** : `PUT /admin/reviews/:id/approve`

**Paramètres d'URL** :
- `id` - ID de l'avis à approuver

**Réponse en cas de succès (200 OK)** :
```json
{
  "id": "string",
  "is_approved": true,
  "is_rejected": false,
  "moderated_at": "2025-01-01T00:00:00.000Z"
}
```

### 3. Rejeter un avis

**URL** : `PUT /admin/reviews/:id/reject`

**Paramètres d'URL** :
- `id` - ID de l'avis à rejeter

**Corps de la requête (optionnel)** :
```json
{
  "reason": "Contenu inapproprié"
}
```

**Réponse en cas de succès (200 OK)** :
```json
{
  "id": "string",
  "is_approved": false,
  "is_rejected": true,
  "admin_response": "Contenu inapproprié",
  "moderated_at": "2025-01-01T00:00:00.000Z"
}
```

### 4. Supprimer définitivement un avis

**URL** : `DELETE /admin/reviews/:id`

**Paramètres d'URL** :
- `id` - ID de l'avis à supprimer

**Réponse en cas de succès (200 OK)** :
```json
{
  "success": true,
  "message": "Avis supprimé avec succès"
}
```

### 5. Obtenir des statistiques sur les avis

**URL** : `GET /admin/reviews/stats`

**Réponse en cas de succès (200 OK)** :
```json
{
  "total": 100,
  "approved": 80,
  "pending": 15,
  "rejected": 5,
  "averageRating": "4.5",
  "lastUpdated": "2025-01-01T00:00:00.000Z"
}
```

## Codes d'erreur

- **400 Bad Request** : Requête invalide
- **401 Unauthorized** : Authentification requise
- **403 Forbidden** : Droits insuffisants
- **404 Not Found** : Avis non trouvé
