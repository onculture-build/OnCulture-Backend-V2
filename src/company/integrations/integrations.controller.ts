import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from '../../common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from '../../auth/interfaces';
import { InitIntegrationDto } from './dto/init-integration.dto';
import { FinishIntegrationDto } from './dto/finish-integration.dto';
import { AppUtilities } from '../../common/utils/app.utilities';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }

  @ApiOperation({ summary: 'Integrate third party service' })
  @AuthStrategy(AuthStrategyType.JWT)
  @Get(':type/init')
  async initIntegration(@Param() params: InitIntegrationDto, @Req() req: RequestWithUser) {
    const data = { ...req, type: params?.type }
    return this.integrationsService.handleIntegrationRequest(params?.type, data);
  }

  @ApiOperation({ summary: 'Integrate third party service' })
  @AuthStrategy(AuthStrategyType.PUBLIC)
  @Get('/finish')
  async finalizeIntegration(@Query() query: FinishIntegrationDto) {
    const {type, ...data} = JSON.parse(AppUtilities.decode(query?.state))
    return this.integrationsService.configure(type, data);
  }
}
