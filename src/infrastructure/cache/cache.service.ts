import { Injectable, Inject, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Temps d'expiration en secondes
  prefix?: string; // Préfixe pour les clés de cache
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTtl = 60 * 60; // 1 heure par défaut
  private readonly defaultPrefix = 'cache:';

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Récupère une valeur depuis le cache
   * @param key Clé de cache
   * @returns La valeur mise en cache ou null si non trouvée
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(this.getKeyWithPrefix(key));
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return null;
    }
  }

  /**
   * Stocke une valeur dans le cache
   * @param key Clé de cache
   * @param value Valeur à stocker
   * @param options Options de cache (TTL, préfixe)
   */
  async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const { ttl = this.defaultTtl, prefix = this.defaultPrefix } = options;
    const cacheKey = this.getKeyWithPrefix(key, prefix);
    
    const stringValue = JSON.stringify(value);
    
    if (ttl > 0) {
      await this.redis.setex(cacheKey, ttl, stringValue);
    } else {
      await this.redis.set(cacheKey, stringValue);
    }
  }

  /**
   * Supprime une clé du cache
   * @param key Clé à supprimer
   * @returns Nombre de clés supprimées
   */
  async delete(key: string, prefix: string = this.defaultPrefix): Promise<number> {
    return this.redis.del(this.getKeyWithPrefix(key, prefix));
  }

  /**
   * Vide tout le cache ou une partie avec un préfixe
   * @param prefix Préfixe des clés à supprimer (optionnel)
   */
  async clear(prefix: string = this.defaultPrefix): Promise<void> {
    const keys = await this.redis.keys(`${prefix}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * Vérifie si une clé existe dans le cache
   * @param key Clé à vérifier
   * @returns true si la clé existe, false sinon
   */
  async has(key: string, prefix: string = this.defaultPrefix): Promise<boolean> {
    const exists = await this.redis.exists(this.getKeyWithPrefix(key, prefix));
    return exists === 1;
  }

  /**
   * Récupère une valeur depuis le cache ou l'obtient via la fonction de rappel si non trouvée
   * @param key Clé de cache
   * @param callback Fonction pour obtenir la valeur si non en cache
   * @param options Options de cache (TTL, préfixe)
   * @returns La valeur mise en cache ou la valeur fraîchement obtenue
   */
  async getOrSet<T>(
    key: string, 
    callback: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    await this.set(key, value, options);
    return value;
  }

  private getKeyWithPrefix(key: string, prefix: string = this.defaultPrefix): string {
    return `${prefix}${key}`;
  }

  /**
   * Récupère plusieurs clés correspondant à un motif
   * @param pattern Motif de recherche des clés
   * @returns Liste des clés correspondantes
   */
  async getKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error(`Erreur lors de la récupération des clés avec le motif ${pattern}`, errorMessage);
      return [];
    }
  }

  /**
   * Supprime plusieurs clés du cache
   * @param keys Tableau de clés à supprimer
   * @returns Nombre de clés supprimées
   */
  async deleteMultiple(keys: string[]): Promise<number> {
    if (!keys || keys.length === 0) return 0;
    
    try {
      // Diviser en lots pour éviter les problèmes de performance
      const batchSize = 100;
      let deletedCount = 0;
      
      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const count = await this.redis.del(...batch);
        deletedCount += count;
      }
      
      return deletedCount;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('Erreur lors de la suppression multiple des clés', errorMessage);
      return 0;
    }
  }

  /**
   * Vide tout le cache
   * @returns true si réussi, false sinon
   */
  async flushAll(): Promise<boolean> {
    try {
      await this.redis.flushall();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('Erreur lors de la suppression de tout le cache', errorMessage);
      return false;
    }
  }
}
