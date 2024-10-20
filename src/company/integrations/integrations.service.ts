import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SlackProvider } from '../../common/third-party/providers/slack/slack-integration';
import { BaseIntegrationProvider } from '../../common/third-party/providers/base-integration';
import {
  IntegrationProviders,
  ProviderConfig,
  ProviderGroup,
  ProviderMember,
} from '../../common/third-party/interfaces';
import { CrudService } from '../../common/database/crud.service';
import { IntegrationMapType } from './integrations.maptype';
import { Prisma, PrismaClient } from '.prisma/company';
import { ConfigService } from '@nestjs/config';
import { IntegrationQuery } from '../interfaces';
import { buildIntegrationQuery } from '../../common/utils/query';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class IntegrationsService extends CrudService<
  Prisma.IntegrationsConfigDelegate,
  IntegrationMapType
> {
  constructor(
    private slack: SlackProvider,
    private companyPrismaClient: PrismaClient,
    private config: ConfigService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(companyPrismaClient.integrationsConfig);
  }

  private getIntegrationsProvider(): Record<string, BaseIntegrationProvider> {
    return {
      [IntegrationProviders.SLACK]: this.slack,
    };
  }

  private getIntegrationProvider(
    integration_type: IntegrationProviders,
  ): BaseIntegrationProvider {
    const getPlatform = this.getIntegrationsProvider();
    const provider = getPlatform[integration_type];
    if (!provider) {
      throw new NotFoundException(
        `Integration provider not found for ${integration_type}`,
      );
    }
    return provider;
  }

  public async configure(
    integration_type: IntegrationProviders,
    payload: any,
  ): Promise<string> {
    const provider = this.getIntegrationProvider(integration_type);
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
            config_meta: config as Prisma.JsonObject,
            source: integration_type,
            environment: env,
            createdBy: payload?.user?.userId,
          },
        });
        result = true;
      }

      // const maxAge = 24 * 60 * 60 * 1000;
      // const accessToken = this.jwtService.sign(
      //   {
      //     userId: payload.userId,
      //     branchId: payload.branchId,
      //     employeeId: payload?.employeeId,
      //     createdAt: moment().format(),
      //   },
      //   {
      //     secret: this.configService.get('jwt.secret'),
      //     expiresIn: maxAge,
      //   },
      // );

      // response.cookie('access_token', accessToken, {
      //   httpOnly: true,
      //   secure: this.configService.get('app.stage') === 'prod',
      //   maxAge: maxAge,
      //   expires: new Date(new Date().getTime() + maxAge),
      //   sameSite: 'none',
      // });
    } catch (error) {
      result = false;
      throw new UnprocessableEntityException(
        error.message || 'an error occurred',
      );
    } finally {
      const getBaseClient = this.config.get<string>('app.clientUrl');
      return `https://${payload?.companyCode}.${getBaseClient}/account/integrations?type=${integration_type}&success=${result}`;
    }
  }

  async getIntegrationConfig(queryParam: IntegrationQuery) {
    const query = buildIntegrationQuery(queryParam);
    return await this.companyPrismaClient.integrationsConfig.findFirst({
      where: query,
    });
  }

  public handleIntegrationRequest(
    integration_type: IntegrationProviders,
    payload: Record<string, any>,
  ) {
    const provider = this.getIntegrationProvider(integration_type);
    const uri = provider.getIntegrationUri(payload);
    return { uri };
  }

  public async getAllIntegrations(queryParam: IntegrationQuery) {
    const query = buildIntegrationQuery(queryParam);
    return await this.companyPrismaClient.integrationsConfig.findMany({
      where: query,
      distinct: ['integration_type'],
      select: {
        id: true,
        integration_type: true,
        source: true,
        environment: true,
      },
    });
  }

  public async getAllMembers(
    source: IntegrationProviders,
  ): Promise<ProviderMember[]> {
    const provider = this.getIntegrationProvider(source);
    const { config_meta } = await this.getIntegrationConfig({
      source,
    });
    const config = config_meta as Prisma.JsonObject;
    if (!config) {
      throw new BadRequestException('config not found');
    }
    return await provider.getMembers(config);
  }

  public async getAllGroups(
    source: IntegrationProviders,
  ): Promise<ProviderGroup[]> {
    const provider = this.getIntegrationProvider(source);
    const { config_meta } = await this.getIntegrationConfig({
      source,
    });
    if (!config_meta) {
      throw new BadRequestException('config not found');
    }
    return await provider.getGroups(config_meta as ProviderConfig);
  }

  public async getMembersOfGroup(
    integration_type: IntegrationProviders,
    groupId: string,
  ): Promise<ProviderMember[]> {
    const provider = this.getIntegrationProvider(integration_type);
    const { config_meta } = await this.getIntegrationConfig({
      integration_type,
    });
    if (!config_meta) {
      throw new BadRequestException('config not found');
    }
    return await provider.groupMembers(config_meta as ProviderConfig, groupId);
  }
}
