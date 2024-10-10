import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import {
  allowedImageMimeTypes,
  PROFILE_UPLOAD_MAX_SIZE_BYTES,
} from '@@/common/constants';
import { DocumentUploadInterceptor } from '@@/common/interceptors/document.interceptor';
import { UploadUserPhotoDto } from '../user/dto/upload-user-photo.dto';
import { IntegrationMemberDto } from './dto/create-employee-integration.dto';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { EmploymentTypesService } from './employment-types/employment-types.service';

@ApiTags('Employees')
@AuthStrategy(AuthStrategyType.JWT)
@ApiBearerAuth()
@Controller('employees')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private employmentTypeService: EmploymentTypesService,
  ) {}

  @ApiOperation({ summary: 'Get filter fields for employees' })
  @Get('filters')
  async getEmployeeFilterFields() {
    return this.employeeService.getEmployeeFilterFields();
  }

  @ApiOperation({ summary: 'Get employment types' })
  @Get('employment-types')
  async getEmploymentTypes(@Query() dto: PaginationSearchOptionsDto) {
    return this.employmentTypeService.getEmploymentTypes(dto);
  }

  @ApiOperation({ summary: 'Get all company employees' })
  @Get()
  async getAllEmployees(@Query() dto: GetEmployeesDto) {
    return this.employeeService.getAllEmployees(dto);
  }

  @ApiOperation({ summary: 'Get all company employees' })
  @Get(':id/job-timeline')
  async getEmployeeTimline(@Param('id') id: string) {
    const res = this.employeeService.getEmployeeJobTimeline(id);
    console.log('🚀 ~ EmployeeController ~ getEmployeeTimline ~ res:', res);

    return res;
  }

  @ApiOperation({ summary: 'Create Employees from integration Provider' })
  @Post('create/integration')
  async createEmloyeesFromIntegrations(
    @Body() dto: IntegrationMemberDto,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.enqueueEmployeeCreation(dto, req);
  }

  @ApiOperation({ summary: 'Get an employee' })
  @Get(':id')
  async getEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeService.getEmployee(id);
  }

  @ApiResponseMeta({ message: 'Employee created successfully' })
  @ApiOperation({ summary: 'Create an employee' })
  @Post('create')
  async createEmployee(
    @Body() dto: CreateEmployeeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.createEmployee(dto, undefined, req);
  }

  @ApiResponseMeta({ message: 'Employee data updated successfully' })
  @ApiOperation({ summary: 'Edit an employee' })
  @Patch(':id/update')
  async updateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.updateEmployee(id, dto, req);
  }

  @ApiResponseMeta({ message: 'Profile picture updated successfully' })
  @ApiOperation({ summary: 'Upload employee profile picture' })
  @ApiConsumes('multipart/form-data')
  @Put(':id/profile-photo')
  @UseInterceptors(
    new DocumentUploadInterceptor().createInterceptor(
      'photo',
      allowedImageMimeTypes,
      null,
      PROFILE_UPLOAD_MAX_SIZE_BYTES,
    ),
  )
  async changeUserPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: UploadUserPhotoDto,
    @Req() req: RequestWithUser,
  ) {
    if (!photo) throw new UnprocessableEntityException('Photo is required');
    dto.photo = photo;

    return await this.employeeService.updateEmployeeProfilePicture(
      id,
      dto,
      req,
    );
  }

  @ApiResponseMeta({ message: 'Employee deactivated successfully' })
  @ApiOperation({ summary: 'Deactivate or Archive an employee' })
  @Patch(':id/deactivate')
  async deactivateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.deactivateEmployee(id, req);
  }

  @ApiResponseMeta({ message: 'Employee reactivated successfully' })
  @ApiOperation({ summary: 'Reactivate or Archive an employee' })
  @Patch(':id/reactivate')
  async reactivateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.reactivateEmployee(id, req);
  }
}
