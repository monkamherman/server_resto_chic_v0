import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { getMetrics } from "./metrics";

@Controller("metrics")
export class MetricsController {
  @Get()
  async getMetrics(@Res() res: Response) {
    try {
      const { contentType, metrics } = await getMetrics();
      res.set("Content-Type", contentType);
      res.send(metrics);
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération des métriques");
    }
  }
}
