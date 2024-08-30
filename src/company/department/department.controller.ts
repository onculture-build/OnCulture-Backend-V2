import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { GetAllDepartmentsDto } from './dto/get-all-departments.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { UpdateDepartmentStatusDto } from './dto/update-department-status.dto';

@ApiTags('Departments')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @ApiOperation({ summary: 'Get all departments' })
  @Get()
  async getAllDepartments(@Query() dto: GetAllDepartmentsDto) {
    return this.departmentService.getAllDepartments(dto);
  }

  @ApiOperation({ summary: 'Get department by id' })
  @Get(':id')
  async getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @ApiOperation({ summary: 'Get department members (employees)' })
  @Get(':id/members')
  async getDepartmentMembers(@Param('id') id: string) {
    return this.departmentService.getDepartmentMembers(id);
  }

  @ApiOperation({ summary: 'Create a department' })
  @Post()
  async createDepartment(
    @Body() dto: CreateDepartmentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.departmentService.createDepartment(dto, req);
  }

  @ApiOperation({ summary: 'Update a department' })
  @ApiResponseMeta({ message: 'Department updated successfully' })
  @Patch(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.departmentService.updateDepartment(id, dto, req);
  }

  @ApiOperation({ summary: "Update a department's status" })
  @Patch(':id/status')
  async updateDepartmentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentStatusDto,
    @Req() req: RequestWithUser,
  ) {
    return this.departmentService.updateDepartmentStatus(id, dto, req);
  }
}
