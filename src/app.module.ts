import { APP_GUARD } from '@nestjs/core';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';
import appConfig from './common/config/app.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheService } from './common/cache/cache.service';
import { CacheModule } from './common/cache/cache.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { CompanyModule } from './company/company.module';
import { FileModule } from './common/file/file.module';
import { AppGuard } from './auth/guard/app.guard';
import { MessagingModule } from './common/messaging/messaging.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { CompanyMiddleware } from './common/middleware/tenant.middleware';

@Global()
@Module({
  imports: [
    AuthModule,
    BaseModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        prefix: `${config.get('environment')}:${config.get('app.name')}`,
        redis: config.get('redis'),
        defaultJobOptions: { removeOnComplete: true },
      }),
    }),
    CacheModule,
    CompanyModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    DatabaseModule,
    FileModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiry'),
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    JwtService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: AppGuard },
  ],
  exports: [CacheModule, DatabaseModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompanyMiddleware).forRoutes('*');
  }
}
