import { Injectable } from '@nestjs/common';
import { SlackProvider } from '../../common/third-party/providers/slack/slack-integration';
import { BaseIntegrationProvider } from '../../common/third-party/providers/base-integration';
import { IntegrationProviders, ProviderConfig } from '../../common/third-party/interfaces';

@Injectable()
export class IntegrationsService {
  constructor(private slack: SlackProvider) { }

  private getIntegrations(): Record<string, BaseIntegrationProvider> {
    return {
      [IntegrationProviders.SLACK]: this.slack,
    };
  }

  private getIntegration(
    integration_type: IntegrationProviders,
  ): BaseIntegrationProvider {
    const getPlatform = this.getIntegrations();
    const provider = getPlatform[integration_type];
    if (!provider) {
      throw new Error(`Integration provider not found for ${integration_type}`);
    }
    return provider;
  }

  public async configure(
    integration_type: IntegrationProviders,
    payload: any,
  ): Promise<ProviderConfig> {
    const provider = this.getIntegration(integration_type);
    return provider.getConfig(payload);
  }

  public handleIntegrationRequest(
    integration_type: IntegrationProviders,
    payload: Record<string, any>,
  ) {
    const provider = this.getIntegration(integration_type);
    return provider.getIntegrationUri(payload);
  }
}
