import { ProviderConfig } from '../../interfaces';

export class SlackConfig implements ProviderConfig {
  slackAccessToken?: string;
  slackTeamId?: string;
  botId?: string;
}
