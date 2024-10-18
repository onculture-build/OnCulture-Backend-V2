import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobRoleService } from './job-role.service';
import { GetAllJobRolesDto } from './dto/get-job-roles.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { UpdateJobRoleDto } from './dto/update-job-role.dto';

@ApiTags('Job Roles')
@AuthStrategy(AuthStrategyType.JWT)
@ApiBearerAuth()
@Controller('job-role')
export class JobRoleController {
  constructor(private jobRoleService: JobRoleService) {}

  @ApiOperation({ summary: 'Get all job roles' })
  @Get()
  async getAllJobRoles(@Query() dto: GetAllJobRolesDto) {
    return this.jobRoleService.getAllJobRoles(dto);
  }

  @ApiOperation({ summary: 'Get  job roles with employee count' })
  @Get('/count')
  async getJobRolesWithCount(@Query() dto: GetAllJobRolesDto) {
    return this.jobRoleService.getJobRoleWithCounts(dto);
  }

  @ApiOperation({ summary: 'Create a job role' })
  @Post()
  async createJobRole(
    @Body() dto: CreateJobRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobRoleService.createJobRole(dto, req);
  }

  @ApiOperation({ summary: 'Update a job role' })
  @Patch(':id')
  async updateJobRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobRoleService.updateJobRole(id, dto, req);
  }

  @ApiOperation({ summary: 'Delete a job role' })
  @Delete(':id')
  async deleteJobRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobRoleService.deleJobRole(id);
  }
}
