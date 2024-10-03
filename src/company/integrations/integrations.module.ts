import { Global, Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { SlackProvider } from '../../common/third-party/providers/slack/slack-integration';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, SlackProvider, JwtService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
