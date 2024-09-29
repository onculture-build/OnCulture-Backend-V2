import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from '../../common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from '../../auth/interfaces';
import { ReadIntegrationDto } from './dto/read-integration.dto';

@ApiTags('Integrations')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @ApiOperation({ summary: 'Integrate third party service' })
  @Get(':type')
  async initIntegration(@Param() params: ReadIntegrationDto, @Req() req: RequestWithUser,) {
    return this.integrationsService.handleIntegrationRequest(params.type, req);
  }
}
