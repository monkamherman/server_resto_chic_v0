import { Module } from '@nestjs/common';
import { RedisModule } from './cache/redis.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [RedisModule, CacheModule],
  exports: [RedisModule, CacheModule],
})
export class InfrastructureModule {}
