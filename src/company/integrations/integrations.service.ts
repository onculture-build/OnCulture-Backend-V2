import { Injectable } from '@nestjs/common';
import { SlackProvider } from '../../common/third-party/providers/slack/slack-integration';
import { BaseIntegrationProvider } from '../../common/third-party/providers/base-integration';
import { IntegrationProviders, ProviderConfig } from '../../common/third-party/interfaces';
import { CrudService } from '../../common/database/crud.service';
import { IntegrationMapType } from './integrations.maptype';
import { Prisma, PrismaClient } from '.prisma/company';
import { ConfigService } from '@nestjs/config';
import { PrismaClientManager } from '../../common/database/prisma-client-manager';

@Injectable()
export class IntegrationsService extends CrudService<
  Prisma.IntegrationsConfigDelegate,
  IntegrationMapType
> {
  constructor(private slack: SlackProvider,
    private companyPrismaClient: PrismaClient,
    private config: ConfigService,
    private prismaClientManager: PrismaClientManager,
  ) {
    super(companyPrismaClient.integrationsConfig);
  }

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
  ): Promise<boolean> {
    const cPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(payload);
    const provider = this.getIntegration(integration_type);
    const config = provider.getConfig(payload);
    const env:any = this.config.get<string>('environment')
    await cPrisma.integrationsConfig.create({
      data: {
        config_meta: JSON.stringify(config),
        source: integration_type,
        environment: env,
        createdBy: payload?.user?.userId
        
      }
    })

    return true
  }

  public handleIntegrationRequest(
    integration_type: IntegrationProviders,
    payload: Record<string, any>,
  ) {
    const provider = this.getIntegration(integration_type);
    const uri = provider.getIntegrationUri(payload);
    return { uri }
  }
}
