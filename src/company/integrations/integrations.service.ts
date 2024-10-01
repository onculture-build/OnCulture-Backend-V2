import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SlackProvider } from '../../common/third-party/providers/slack/slack-integration';
import { BaseIntegrationProvider } from '../../common/third-party/providers/base-integration';
import { IntegrationProviders } from '../../common/third-party/interfaces';
import { CrudService } from '../../common/database/crud.service';
import { IntegrationMapType } from './integrations.maptype';
import { Prisma, PrismaClient } from '.prisma/company';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntegrationsService extends CrudService<
  Prisma.IntegrationsConfigDelegate,
  IntegrationMapType
> {
  constructor(
    private slack: SlackProvider,
    private companyPrismaClient: PrismaClient,
    private config: ConfigService,
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
      throw new NotFoundException(`Integration provider not found for ${integration_type}`);
    }
    return provider;
  }

  public async configure(
    integration_type: IntegrationProviders,
    payload: any,
  ): Promise<string> {
    const provider = this.getIntegration(integration_type);
    let result = false;
    try {
      const config = await provider.getConfig(payload);
      const env: any =
        this.config.get<string>('environment') === 'development'
          ? 'staging'
          : 'production';
      if (config) {
        await this.companyPrismaClient.integrationsConfig.create({
          data: {
            config_meta: JSON.stringify(config),
            source: integration_type,
            environment: env,
            createdBy: payload?.user?.userId,
          },
        });
        result = true;
      }
    } catch (error) {
      result = false;
      throw new HttpException(
        error.message || 'an error occurred',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } finally {
      return `${process.env.CLIENT_URL}/dashboard/account?type=${integration_type}&success=${result}`;
    }
  }

  public handleIntegrationRequest(
    integration_type: IntegrationProviders,
    payload: Record<string, any>,
  ) {
    const provider = this.getIntegration(integration_type);
    const uri = provider.getIntegrationUri(payload);
    return { uri };
  }
}
