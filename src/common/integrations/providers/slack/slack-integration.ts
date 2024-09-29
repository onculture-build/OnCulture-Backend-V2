import { Injectable } from '@nestjs/common';
import { BaseIntegrationProvider } from '../base-integration';
import { SlackConfig } from './slack-utils';
import { WebClient } from '@slack/web-api';
import { IntegrationProviders } from '../../interfaces';

@Injectable()
export class SlackProvider extends BaseIntegrationProvider {
  private baseClient: WebClient
  constructor() {
    super(IntegrationProviders.SLACK);
    this.baseClient = new WebClient()
  }
  async getConfig(code: string): Promise<SlackConfig> {
    const response = await this.baseClient.oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
    })

    const config: SlackConfig = {
      slackAccessToken: response?.access_token,
      slackTeamId: response?.team?.id,
      botId: response?.bot_user_id
    }

    return config

  }
  async connect(config: SlackConfig): Promise<any> {
    const client = new WebClient(config.slackAccessToken);
    return client.oauth
  }
}
