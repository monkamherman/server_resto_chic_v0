"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsMiddleware = void 0;
const common_1 = require("@nestjs/common");
const metrics_1 = require("../metrics/metrics");
let MetricsMiddleware = class MetricsMiddleware {
    use(req, res, next) {
        // Ignorer les requêtes vers les endpoints de métriques et de santé
        if (req.path === '/metrics' || req.path === '/health') {
            return next();
        }
        const start = process.hrtime();
        const path = req.route?.path || req.path;
        // Incrémenter le compteur de requêtes
        res.on('finish', () => {
            const duration = process.hrtime(start);
            const durationInMs = (duration[0] * 1e9 + duration[1]) / 1e6;
            // Enregistrer la durée de la requête
            metrics_1.httpRequestDurationMicroseconds
                .labels(req.method, path, res.statusCode.toString())
                .observe(durationInMs / 1000); // Convertir en secondes
            // Incrémenter le compteur de requêtes
            metrics_1.httpRequestCounter.inc({
                method: req.method,
                route: path,
                status_code: res.statusCode.toString(),
            });
        });
        next();
    }
};
exports.MetricsMiddleware = MetricsMiddleware;
exports.MetricsMiddleware = MetricsMiddleware = __decorate([
    (0, common_1.Injectable)()
], MetricsMiddleware);
//# sourceMappingURL=metrics.middleware.js.map