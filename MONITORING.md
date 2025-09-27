# Guide de Surveillance du Projet

Ce guide explique comment utiliser la solution de surveillance intégrée au projet.

## Services Disponibles

- **Grafana**: http://localhost:3000
  - Utilisateur: `admin`
  - Mot de passe: `admin`

- **Prometheus**: http://localhost:9090

- **AlertManager**: http://localhost:9093

- **cAdvisor**: http://localhost:8080

## Démarrer la surveillance

1. Démarrer les services principaux :

   ```bash
   docker-compose up -d
   ```

2. Démarrer les services de surveillance :
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

## Tableaux de bord disponibles

1. **Node Exporter**
   - Métriques système (CPU, mémoire, disque, réseau)
   - Disponible dans Grafana sous "Node Exporter"

2. **cAdvisor**
   - Métriques des conteneurs Docker
   - Vue détaillée de l'utilisation des ressources par conteneur

3. **Application Node.js**
   - Métriques personnalisées de l'application
   - Suivi des performances et des erreurs

## Configuration

### Variables d'environnement

Copiez le fichier `.env.monitoring.example` vers `.env.monitoring` et ajustez les valeurs selon vos besoins.

### Ajouter des métriques personnalisées

Pour ajouter des métriques personnalisées à votre application Node.js, utilisez le client Prometheus :

```javascript
const promClient = require("prom-client");

// Créer un compteur personnalisé
const customCounter = new promClient.Counter({
  name: "myapp_custom_metric",
  help: "Description de la métrique personnalisée",
  labelNames: ["status"],
});

// Incrémenter le compteur
customCounter.inc({ status: "success" });
```

## Alertes

Les alertes sont configurées dans `monitoring/alertmanager/config.yml`. Par défaut, des alertes sont définies pour :

- Haute utilisation CPU
- Faible espace disque
- Services indisponibles
- Problèmes de conteneurs

## Maintenance

### Mettre à jour les services

```bash
docker-compose -f docker-compose.monitoring.yml pull
docker-compose -f docker-compose.monitoring.yml up -d
```

### Sauvegarder les données

Les données sont stockées dans des volumes Docker. Pour les sauvegarder :

```bash
# Sauvegarder les données de Prometheus
docker run --rm -v prometheus_data:/source -v $(pwd):/backup alpine tar czf /backup/prometheus_backup.tar.gz -C /source ./

# Sauvegarder les données de Grafana
docker run --rm -v grafana_data:/source -v $(pwd):/backup alpine tar czf /backup/grafana_backup.tar.gz -C /source ./
```

## Dépannage

### Vérifier les logs

```bash
# Voir les logs de tous les services
docker-compose -f docker-compose.monitoring.yml logs -f

# Voir les logs d'un service spécifique
docker-compose -f docker-compose.monitoring.yml logs -f prometheus
```

### Redémarrer un service

```bash
docker-compose -f docker-compose.monitoring.yml restart [nom_du_service]
```

## Sécurité

- Changez les identifiants par défaut dans `.env.monitoring`
- Ne pas exposer les ports de surveillance sur Internet
- Utilisez un reverse proxy avec authentification pour un accès distant
