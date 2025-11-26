"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequestDurationMicroseconds = exports.activeConnectionsGauge = exports.httpRequestCounter = void 0;
exports.getMetrics = getMetrics;
exports.initMetrics = initMetrics;
const prom_client_1 = require("prom-client");
// Créer un registre personnalisé
const register = new prom_client_1.Registry();
// Activer la collecte des métriques par défaut avec le registre personnalisé
(0, prom_client_1.collectDefaultMetrics)({ register });
// Métriques personnalisées
exports.httpRequestCounter = new prom_client_1.Counter({
    name: "http_requests_total",
    help: "Total des requêtes HTTP",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
});
exports.activeConnectionsGauge = new prom_client_1.Gauge({
    name: "node_active_connections",
    help: "Nombre de connexions actives",
    registers: [register],
});
exports.httpRequestDurationMicroseconds = new prom_client_1.Histogram({
    name: "http_request_duration_seconds",
    help: "Durée des requêtes HTTP en secondes",
    labelNames: ["method", "route", "code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    registers: [register],
});
// Fonction pour exposer les métriques
async function getMetrics() {
    return {
        contentType: register.contentType,
        metrics: await register.metrics(),
    };
}
// Fonction pour initialiser les métriques
function initMetrics() {
    // Cette fonction peut être utilisée pour initialiser des compteurs ou jauges personnalisés
    return register;
}
//# sourceMappingURL=metrics.js.map