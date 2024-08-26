import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseCountryService } from './base-country.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { BaseStateService } from '../base-state/base-state.service';

@ApiTags('Countries & States')
@AuthStrategy(AuthStrategyType.PUBLIC)
@Controller('countries')
export class BaseCountryController {
  constructor(
    private countryService: BaseCountryService,
    private stateService: BaseStateService,
  ) {}

  @ApiOperation({ summary: 'Get all countries' })
  @Get()
  async getCountries(@Query() query: PaginationSearchOptionsDto) {
    return this.countryService.getCountries(query);
  }

  @ApiOperation({ summary: 'Get a country' })
  @Get(':id')
  async getCountry(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.countryService.getCountry(id, req);
  }

  @ApiOperation({ summary: 'Get all states in a country' })
  @Get(':countryId/states')
  async getCountryStates(
    @Param('countryId') countryId: string,
    @Query() query: PaginationSearchOptionsDto,
  ) {
    return this.stateService.getStates(countryId, query);
  }

  @ApiOperation({ summary: 'Get a specific state in a country' })
  @Get(':countryId/states/:stateId')
  async getCountryState(
    @Param('countryId', ParseUUIDPipe) countryId: string,
    @Param('stateId', ParseUUIDPipe) stateId: string,
  ) {
    return this.stateService.getState(countryId, stateId);
  }
}
