import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService],
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // store: redisStore,
        // host: configService.get<string>('redis.host'),
        // port: configService.get<number>('redis.port'),
        // password: configService.get<string>('redis.password'),
        // ttl: configService.get<number>('redis.cacheTtl'),
        // no_ready_check: true,
        store: await redisStore({
          url: configService.get<string>('redis.url'),
          ttl: configService.get<number>('redis.cacheTtl'),
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
