import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService],
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        ttl: configService.get<number>('redis.cacheTtl'),
        no_ready_check: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
