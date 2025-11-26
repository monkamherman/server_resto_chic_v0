import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;
    const limit = 10; // Limite de requêtes
    const ttl = 60; // Durée en secondes (1 minute)

    const current = await this.redisService.incrWithExpire(key, ttl);
    if (current > limit) {
      return res.status(429).json({ message: 'Trop de requêtes, veuillez réessayer plus tard.' });
    }

    next();
  }
}
