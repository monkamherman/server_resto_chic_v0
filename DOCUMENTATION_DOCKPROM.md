# Documentation de la solution de surveillance DockProm

## Vue d'ensemble

DockProm est une solution complète de surveillance pour les hôtes et conteneurs Docker. Elle utilise une stack d'outils open source pour fournir une surveillance complète et des tableaux de bord prêts à l'emploi.

## Composants principaux

### 1. Prometheus

- **Rôle** : Collecte et stocke les métriques des différents composants
- **Port** : 9090
- **Fonctionnalités** :
  - Collecte des métriques à intervalles réguliers
  - Stockage des séries temporelles
  - Requêtes puissantes avec PromQL
  - Découverte de services

### 2. Grafana

- **Rôle** : Visualisation des données et tableaux de bord
- **Port** : 3000
- **Identifiants par défaut** :
  - Utilisateur : admin
  - Mot de passe : admin
- **Tableaux de bord inclus** :
  - Vue d'ensemble de l'hôte Docker
  - Surveillance des conteneurs
  - État des services de monitoring

### 3. cAdvisor

- **Rôle** : Collecte les métriques d'utilisation des ressources des conteneurs
- **Port** : 8080
- **Métriques collectées** :
  - Utilisation CPU
  - Utilisation mémoire
  - Utilisation réseau
  - Utilisation disque

### 4. NodeExporter

- **Rôle** : Collecte les métriques du système hôte
- **Port** : 9100
- **Métriques collectées** :
  - Utilisation CPU
  - Utilisation mémoire
  - Utilisation disque
  - Charge système
  - Températures

### 5. AlertManager

- **Rôle** : Gestion des alertes
- **Port** : 9093
- **Fonctionnalités** :
  - Agrégation des alertes
  - Dédoublonnage
  - Envoi de notifications
  - Gestion du bruit

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/stefanprodan/dockprom
cd dockprom
```

2. Démarrer les services :

```bash
ADMIN_USER='admin' \
ADMIN_PASSWORD='admin' \
ADMIN_PASSWORD_HASH='$2a$14$1l.IozJx7xQRVmlkEQ32OeEEfP5mRxTpbDTCTcXRqn19gXD8YK1pO' \
docker-compose up -d
```

## Configuration

### Variables d'environnement

- `ADMIN_USER` : Nom d'utilisateur pour l'authentification (par défaut : admin)
- `ADMIN_PASSWORD` : Mot de passe en clair (utilisé pour Grafana)
- `ADMIN_PASSWORD_HASH` : Hash du mot de passe (utilisé par Caddy)

### Personnalisation des tableaux de bord

Les tableaux de bord Grafana sont stockés dans `grafana/provisioning/dashboards/` et peuvent être modifiés selon les besoins.

## Gestion des alertes

### Alertes prédéfinies

1. **Services de monitoring** :
   - Vérifie que les services de monitoring sont opérationnels

2. **Hôte Docker** :
   - Charge CPU élevée
   - Mémoire presque saturée
   - Espace disque faible
   - Système en panne

3. **Conteneurs** :
   - Redémarrage des conteneurs
   - Utilisation CPU élevée
   - Utilisation mémoire élevée

### Configuration des alertes

Les règles d'alerte sont définies dans `prometheus/alert.rules` et peuvent être rechargées sans redémarrer Prometheus :

```bash
curl -X POST http://admin:admin@localhost:9090/-/reload
```

## Surveillance avancée

### Ajout d'exportateurs supplémentaires

Des configurations pour des exportateurs supplémentaires sont disponibles dans `docker-compose.exporters.yml`.

### Intégration avec d'autres services

La configuration peut être étendue pour surveiller :

- Services web (Nginx, Apache)
- Bases de données
- Services personnalisés exposant des métriques au format Prometheus

## Dépannage

### Vérification des services

```bash
docker-compose ps
```

### Consultation des logs

```bash
docker-compose logs -f [service]
```

### Redémarrage des services

```bash
docker-compose restart [service]
```

## Sécurité

### Changer les identifiants par défaut

1. Modifier les variables d'environnement dans le fichier `docker-compose.yml`
2. Redémarrer les services

### Accès sécurisé

- Caddy fournit une authentification de base pour Prometheus et AlertManager
- L'accès à Grafana est protégé par mot de passe

## Maintenance

### Mise à jour des conteneurs

```bash
docker-compose pull
docker-compose up -d
```

### Sauvegarde des données

Les données de Prometheus et Grafana sont stockées dans des volumes Docker. Pour les sauvegarder :

```bash
# Sauvegarder les données de Prometheus
docker run --rm -v dockprom_prometheus_data:/source -v $(pwd):/backup alpine tar czf /backup/prometheus_backup.tar.gz -C /source ./

# Sauvegarder les données de Grafana
docker run --rm -v dockprom_grafana_data:/source -v $(pwd):/backup alpine tar czf /backup/grafana_backup.tar.gz -C /source ./
```

## Personnalisation avancée

### Ajout de nouveaux tableaux de bord

1. Créer un nouveau fichier JSON dans `grafana/provisioning/dashboards/`
2. Redémarrer le service Grafana

### Surveillance de métriques personnalisées

1. Configurer Prometheus pour collecter les métriques depuis votre application
2. Créer un nouveau tableau de bord dans Grafana
3. Configurer des alertes si nécessaire

## Dépannage des problèmes courants

### Problèmes de connexion

- Vérifier que les ports ne sont pas déjà utilisés
- Vérifier les logs des conteneurs pour des erreurs

### Données manquantes

- Vérifier que les cibles sont bien configurées dans Prometheus
- Vérifier que les exportateurs fonctionnent correctement

### Performances

- Ajuster les intervalles de collecte si nécessaire
- Surveiller l'utilisation des ressources des conteneurs

## Ressources supplémentaires

- [Documentation Prometheus](https://prometheus.io/docs/)
- [Documentation Grafana](https://grafana.com/docs/)
- [Documentation cAdvisor](https://github.com/google/cadvisor)
- [Documentation NodeExporter](https://github.com/prometheus/node_exporter)
