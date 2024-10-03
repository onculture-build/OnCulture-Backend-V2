import { Controller, Get, Param, Req, Query, Res } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from '../../common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from '../../auth/interfaces';
import { InitIntegrationDto } from './dto/init-integration.dto';
import { FinishIntegrationDto } from './dto/finish-integration.dto';
import { AppUtilities } from '../../common/utils/app.utilities';
import { response, Response } from 'express';
import { IntegrationQuery } from '../interfaces';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @ApiOperation({ summary: 'Integrate third party service' })
  @AuthStrategy(AuthStrategyType.JWT)
  @Get(':type/init')
  async initIntegration(
    @Param() params: InitIntegrationDto,
    @Query() query: { code: string },
    @Req() req: RequestWithUser,
  ) {
    const data = { ...req.user, type: params?.type, companyCode: query?.code };
    return this.integrationsService.handleIntegrationRequest(
      params?.type,
      data,
    );
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
}
