import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { BaseCompanyRequestService } from './base-company-request/base-company-request.service';
import { GetCompanyRequestsDto } from './base-company-request/dto/get-company-requests.dto';
import { BaseCompanyService } from './base-company.service';
import { OnboardCompanyRequestUpdateDto } from './base-company-request/dto/onboard-company-request-update.dto';
import { GetAllCompaniesDto } from './dto/get-all-companies.dto';
import { GetCompanyDomainDto } from './dto/get-domain.dto';
import { ForgotUserCompaniesDto } from './dto/forgot-user-companies.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { UploadLogoDto } from '@@/auth/dto/upload-logo.dto';
import { DocumentUploadInterceptor } from '@@/common/interceptors/document.interceptor';
import {
  allowedImageMimeTypes,
  PROFILE_UPLOAD_MAX_SIZE_BYTES,
} from '@@/common/constants';
import { OpenRoute } from '@@/common/decorators/route.decorator';

@ApiTags('Base Company')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@OpenRoute()
@Controller('companies')
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

  @ApiOperation({ summary: "Get a company's URL" })
  @Post('get-company-url')
  @AuthStrategy(AuthStrategyType.PUBLIC)
  async getCompanyURL(@Body() { code }: GetCompanyDomainDto) {
    return this.companyService.getCompanyURL(code);
  }

  @ApiOperation({ summary: 'Get all companies for a user' })
  @ApiResponseMeta({ message: 'Email sent successfully' })
  @Post('user/forgot-companies')
  @AuthStrategy(AuthStrategyType.PUBLIC)
  async forgotUserCompanies(@Body() { email }: ForgotUserCompaniesDto) {
    return this.companyService.forgotUserCompanies(email);
  }

  @ApiOperation({ summary: 'Get all company requests' })
  @Get('requests')
  async getAllCompanyRequests(@Query() query: GetCompanyRequestsDto) {
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

  @ApiOperation({ summary: 'Get a company using subdomain' })
  @Get('/:code')
  @AuthStrategy(AuthStrategyType.PUBLIC)
  async getCompany(@Param('code') code: string) {
    return this.companyService.getCompanyWithSubdomain(code);
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

  @ApiResponseMeta({ message: 'Logo uploaded successfully' })
  @ApiOperation({ summary: 'Upload a logo for a company' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    new DocumentUploadInterceptor().createInterceptor(
      'logo',
      allowedImageMimeTypes,
      null,
      PROFILE_UPLOAD_MAX_SIZE_BYTES,
    ),
  )
  @Post('upload-logo')
  async uploadLogo(
    @UploadedFile() logo: Express.Multer.File,
    @Body() dto: UploadLogoDto,
    @Req() req: RequestWithUser,
  ) {
    if (!logo) {
      throw new NotAcceptableException('File not uploaded ');
    }
    dto.logo = logo;
    return this.companyService.uploadCompanyLogo(dto, req);
  }
}
