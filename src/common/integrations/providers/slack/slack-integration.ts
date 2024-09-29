import { Injectable } from '@nestjs/common';
import { BaseIntegrationProvider } from '../base-integration';
import { SlackConfig } from './slack-utils';
import { WebClient } from '@slack/web-api';
import { IntegrationProviders } from '../../interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackProvider extends BaseIntegrationProvider<WebClient> {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly clientBotToken: string;
  private readonly clientScope: string;
  private readonly userScope:string
  constructor(private configService: ConfigService) {
    super(IntegrationProviders.SLACK);
    this.clientBotToken = this.configService.get<string>('slack.token.bot');
    this.clientId = this.configService.get<string>('slack.client.id');
    this.clientSecret = this.configService.get<string>('slack.client.secret');
    this.clientScope = this.configService.get<string>('slack.client.scope');
    this.userScope = this.configService.get<string>('slack.user.scope');
    this.baseClient = new WebClient(this.clientBotToken);
  }
  async getConfig(code: string): Promise<SlackConfig> {
    const response = await this.baseClient.oauth.v2.access({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
    });

    const config: SlackConfig = {
      slackAccessToken: response?.access_token,
      slackTeamId: response?.team?.id,
      botId: response?.bot_user_id,
    };

    return config;
  }
  async connect(config: SlackConfig): Promise<WebClient> {
    const client = new WebClient(config.slackAccessToken);
    return client;
  }

  getIntegrationUri(payload?: Record<string, any>): string {
    const authBaseUri = "https://slack.com/oauth/v2/authorize" 
    const params = JSON.stringify(payload)
    return `${authBaseUri}?client_id=${this.clientId}&scope=${this.clientScope}&user_scope=${this.userScope}&state=${params}`
  }
}
