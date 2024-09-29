import { Injectable } from '@nestjs/common';
import { SlackProvider } from './providers/slack/slack-integration';
import { BaseIntegrationProvider } from './providers/base-integration';
import { IntegrationProviders, ProviderConfig } from './interfaces';

@Injectable()
export class IntegrationsService {
    constructor(
        private  slack: SlackProvider
    ) {
        
    }

    private getIntegrations(): Record<string, BaseIntegrationProvider> {
        return {
            [IntegrationProviders.SLACK]: this.slack,
        }
    };

    public async authenticate(integration_type:IntegrationProviders, payload:any):Promise<ProviderConfig> {
        const getPlatform = this.getIntegrations()
        const provider = getPlatform[integration_type];
        if (!provider) {
            throw new Error(`Integration provider not found for ${integration_type}`);
        }
        return provider.getConfig(payload);
    }


}
