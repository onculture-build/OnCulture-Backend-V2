import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initSentry(configService: ConfigService) {
  const config = getSentryConfig(configService);
  Sentry.init({ ...config });
}

function getSentryConfig(configService: ConfigService): Sentry.NodeOptions {
  return {
    dsn: configService.get('sentry.dsn'),
    debug: configService.get<string>('sentry.debug') === 'true',
    environment: configService.get<string>('environment'),
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [nodeProfilingIntegration()],
  };
}
