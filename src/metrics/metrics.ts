import {
  collectDefaultMetrics,
  Gauge,
  Counter,
  Histogram,
  Registry,
} from "prom-client";

// Créer un registre personnalisé
const register = new Registry();

// Activer la collecte des métriques par défaut avec le registre personnalisé
collectDefaultMetrics({ register });

// Métriques personnalisées
export const httpRequestCounter = new Counter({
  name: "http_requests_total",
  help: "Total des requêtes HTTP",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const activeConnectionsGauge = new Gauge({
  name: "node_active_connections",
  help: "Nombre de connexions actives",
  registers: [register],
});

export const httpRequestDurationMicroseconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Durée des requêtes HTTP en secondes",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

// Fonction pour exposer les métriques
export async function getMetrics() {
  return {
    contentType: register.contentType,
    metrics: await register.metrics(),
  };
}

// Fonction pour initialiser les métriques
export function initMetrics() {
  // Cette fonction peut être utilisée pour initialiser des compteurs ou jauges personnalisés
  return register;
}
