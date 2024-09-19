import { AuthStrategyType } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BaseCompanyRequestService } from './base-company-request/base-company-request.service';
import { GetCompanyRequestsDto } from './base-company-request/dto/get-company-requests.dto';
import { BaseCompanyService } from './base-company.service';
import { OnboardCompanyRequestUpdateDto } from './base-company-request/dto/onboard-company-request-update.dto';
import { GetAllCompaniesDto } from './dto/get-all-companies.dto';

@ApiTags('Base Company')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('company')
export class BaseCompanyController {
  constructor(
    private companyRequestService: BaseCompanyRequestService,
    private companyService: BaseCompanyService,
  ) {}

  @ApiOperation({ summary: 'Get all companies' })
  @Get()
  async getAllCompanies(@Query() query: GetAllCompaniesDto) {
    return this.companyService.getAllCompanies(query);
  }

  @ApiOperation({ summary: 'Get a company using subdomain' })
  @Get(':subdomain')
  @AuthStrategy(AuthStrategyType.PUBLIC)
  async getCompany(@Param('subdomain') subdomain: string) {
    return this.companyService.getCompany(subdomain);
  }

  @ApiOperation({ summary: 'Get all company requests' })
  @Get('requests')
  async getCompanyRequests(@Query() query: GetCompanyRequestsDto) {
    return this.companyRequestService.getOnboardCompanyRequests(query);
  }

  @ApiOperation({ summary: 'Get a company request by requestId' })
  @Get('requests/:id')
  async getCompanyRequestById(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyRequestService.getRequestCompany(id);
  }

  @ApiOperation({ summary: 'Activate a company' })
  @Post(':id/activate')
  async activateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: OnboardCompanyRequestUpdateDto,
  ) {
    return this.companyService.activateCompany(id, dto);
  }

  @ApiOperation({
    summary: "Update a company's onboarding request or resend activation email",
  })
  @Patch('requests/:id')
  async updateCompanyRequest(
    @Param('id', ParseUUIDPipe) id: string,
    dto: OnboardCompanyRequestUpdateDto,
  ) {
    return this.companyRequestService.updateCompanyRequest(id, dto);
  }
}
