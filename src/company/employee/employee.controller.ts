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
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(dto);
  }

  @ApiOperation({ summary: 'Edit an employee' })
  @Patch(':id/edit')
  async updateEmployee(@Body() dto: UpdateEmployeeDto) {
    return dto;
  }
}
