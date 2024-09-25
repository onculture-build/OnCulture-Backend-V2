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
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@ApiTags('Employees')
@AuthStrategy(AuthStrategyType.JWT)
@ApiBearerAuth()
@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'Get filter fields for employees' })
  @Get('filters')
  async getEmployeeFilterFields() {
    return this.employeeService.getEmployeeFilterFields();
  }

  @ApiOperation({ summary: 'Get all company employees' })
  @Get()
  async getAllEmployees(@Query() dto: GetEmployeesDto) {
    return this.employeeService.getAllEmployees(dto);
  }

  @ApiOperation({ summary: 'Get an employee' })
  @Get(':id')
  async getEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeService.getEmployee(id);
  }

  @ApiOperation({ summary: 'Create an employee' })
  @Post('create')
  async createEmployee(
    @Body() dto: CreateEmployeeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.createEmployee(dto, undefined, req);
  }

  @ApiOperation({ summary: 'Edit an employee' })
  @Patch(':id/update')
  async updateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.updateEmployee(id, dto, req);
  }

  @ApiOperation({ summary: 'Suspend or Archive an employee' })
  @Patch(':id/suspend')
  async suspendEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.employeeService.suspendEmployee(id, req);
  }
}
