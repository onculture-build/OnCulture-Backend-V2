import { Controller, Get, Req, Query, Res, Body, Post } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from '../../common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from '../../auth/interfaces';
import { InitIntegrationDto } from './dto/init-integration.dto';
import { FinishIntegrationDto } from './dto/finish-integration.dto';
import { AppUtilities } from '../../common/utils/app.utilities';
import { response, Response } from 'express';
import { IntegrationQuery } from '../interfaces';
import { IntegrationProviders } from '../../common/third-party/interfaces';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @ApiOperation({ summary: 'Integrate third party service' })
  @AuthStrategy(AuthStrategyType.JWT)
  @Post('/init')
  async initIntegration(
    @Body() body: InitIntegrationDto,
    @Req() req: RequestWithUser,
  ) {
    const data = { ...req.user, ...body };
    return this.integrationsService.handleIntegrationRequest(body?.type, data);
  }

  @ApiOperation({ summary: 'Integrate third party service' })
  @AuthStrategy(AuthStrategyType.PUBLIC)
  @Get('/finish')
  async finalizeIntegration(
    @Query() query: FinishIntegrationDto,
    @Res() res: Response,
  ) {
    const { type, ...data } = JSON.parse(AppUtilities.decode(query?.state));
    data.code = query.code;
    const link = await this.integrationsService.configure(type, data, response);
    return res.redirect(link);
  }

  @ApiOperation({ summary: 'fetch integrations' })
  @AuthStrategy(AuthStrategyType.JWT)
  @Get('/')
  async getAllIntegrations(@Query() query: IntegrationQuery) {
    return await this.integrationsService.getAllIntegrations(query);
  }

  @ApiOperation({ summary: 'fetch memebers from workspace,group,teams' })
  @AuthStrategy(AuthStrategyType.JWT)
  @Get('/member')
  async getAllMembers(@Query('type') type: IntegrationProviders) {
    return await this.integrationsService.getAllMembers(type);
  }

  @ApiOperation({ summary: 'fetch all groups' })
  @AuthStrategy(AuthStrategyType.JWT)
  @Get('/groups')
  async getAllGroups(@Query('type') type: IntegrationProviders) {
    return await this.integrationsService.getAllGroups(type);
  }
}
