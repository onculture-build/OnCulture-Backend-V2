import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseIntegrationProvider } from '../base-integration';
import { SlackConfig } from './slack-utils';
import { WebClient } from '@slack/web-api';
import {
  IntegrationProviders,
  ProviderConfig,
  ProviderMember,
} from '../../interfaces';
import { ConfigService } from '@nestjs/config';
import { AppUtilities } from '../../../utils/app.utilities';

@Injectable()
export class SlackProvider extends BaseIntegrationProvider<WebClient> {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly clientBotToken: string;
  private readonly clientScope: string;
  private readonly userScope: string;
  constructor(private configService: ConfigService) {
    super(IntegrationProviders.SLACK);
    this.clientBotToken = this.configService.get<string>('slack.token.bot');
    this.clientId = this.configService.get<string>('slack.client.id');
    this.clientSecret = this.configService.get<string>('slack.client.secret');
    this.clientScope = this.configService.get<string>('slack.client.scope');
    this.userScope = this.configService.get<string>('slack.user.scope');
    this.baseClient = new WebClient(this.clientBotToken);
  }
  async getConfig(payload: any): Promise<SlackConfig> {
    const { code } = payload;
    try {
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
    } catch (error) {
      throw new Error(error?.message || 'an error occurred creating config');
    }
  }
  async connect(config: SlackConfig): Promise<WebClient> {
    const client = new WebClient(config.slackAccessToken);
    return client;
  }

  getIntegrationUri(payload?: Record<string, any>) {
    const authBaseUri = this.configService.get<string>('slack.base_url');
    const params = AppUtilities.encode(JSON.stringify(payload));
    return `${authBaseUri}?client_id=${this.clientId}&scope=${this.clientScope}&state=${params}`;
  }

  async getMembers(config: SlackConfig) {
    const webClientAgent = await this.connect(config);
    try {
      const res = await webClientAgent.users.list({});
      return res.members.reduce((acc, member) => {
        const { profile } = member || {};
        if (profile?.email) {
          acc.push({
            email: profile.email,
            firstName: profile.real_name,
            image: profile.image_48,
            id: member.id,
            lastName: profile.last_name,
          });
        }
        return acc;
      }, []);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async getGroups(config: SlackConfig) {
    const webClientAgent = await this.connect(config);
    try {
      const res = await webClientAgent.conversations.list({
        types: 'public_channel',
      });
      return res?.channels?.map((channel) => {
        return {
          id: channel.id,
          name: channel.name,
        };
      });
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async groupMembers(
    config: ProviderConfig,
    groupId: string,
  ): Promise<Array<ProviderMember>> {
    const webClientAgent = await this.connect(config);
    try {
      const res = await webClientAgent.conversations.members({
        channel: groupId,
      });

      const getMemebersInfo = res.members.map((userId) =>
        webClientAgent.users.info({ user: userId }).then((userInfo) => ({
          id: userInfo.user.id,
          email: userInfo.user.profile.email,
          firstName: userInfo.user.profile.real_name,
          image: userInfo.user.profile.image_48,
          lastName: userInfo.user.profile.last_name,
        })),
      );
      return await Promise.all(getMemebersInfo);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
