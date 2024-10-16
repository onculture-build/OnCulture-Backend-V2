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
import { MessagingModule } from './common/messaging/messaging.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { CompanyMiddleware } from './common/middleware/company.middleware';
import { PermissionsGuard } from './auth/guard/permission.guard';
import { CaslAbilityFactory } from './auth/casl/casl-ability.factory/casl-ability.factory';
import { PermissionModule } from './company/permission/permission.module';
import { CompositeGuard } from './auth/guard/composite.guard';
import { AppAuthGuard } from './auth/guard/app.guard';
import { SubdomainGuard } from './auth/guard/subdomain.guard';
import { SentryModule } from '@sentry/nestjs/setup';
import { SanityProviderService } from './common/third-party/providers/sanity/sanity.service';

@Global()
@Module({
  imports: [
    SentryModule.forRoot(),
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
    PermissionModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppAuthGuard,
    SubdomainGuard,
    CacheService,
    CaslAbilityFactory,
    JwtService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: CompositeGuard },
    PermissionsGuard,
    SanityProviderService,
  ],
  exports: [CacheModule, DatabaseModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompanyMiddleware).forRoutes('*');
  }
}
