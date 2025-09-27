import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import {
  httpRequestCounter,
  httpRequestDurationMicroseconds,
} from "../metrics/metrics";

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Ignorer les requêtes vers les endpoints de métriques et de santé
    if (req.path === "/metrics" || req.path === "/health") {
      return next();
    }

    const start = process.hrtime();
    const path = req.route?.path || req.path;

    // Incrémenter le compteur de requêtes
    res.on("finish", () => {
      const duration = process.hrtime(start);
      const durationInMs = (duration[0] * 1e9 + duration[1]) / 1e6;

      // Enregistrer la durée de la requête
      httpRequestDurationMicroseconds
        .labels(req.method, path, res.statusCode.toString())
        .observe(durationInMs / 1000); // Convertir en secondes

      // Incrémenter le compteur de requêtes
      httpRequestCounter.inc({
        method: req.method,
        route: path,
        status_code: res.statusCode.toString(),
      });
    });

    next();
  }
}
