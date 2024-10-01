import { Global, Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { SlackProvider } from '../../common/third-party/providers/slack/slack-integration';

@Global()
@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, SlackProvider],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
