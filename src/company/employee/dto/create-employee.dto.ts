import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateJobRoleDto } from '../job-role/dto/create-job-role.dto';
import { Type } from 'class-transformer';
import { SetupUserDto } from '@@/company/user/dto/setup-user.dto';
import { CreateEmploymentTypeDto } from './create-employee-type.dto';
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateEmployeeDto extends SetupUserDto {
  @IsString()
  @IsOptional()
  employeeNo?: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  departmentCode?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsUUID()
  @IsOptional()
  employmentTypeId?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmploymentTypeDto)
  employmentType?: CreateEmploymentTypeDto;

  @IsUUID()
  @IsOptional()
  @ValidateIf((obj) => !obj.jobRole)
  jobRoleId?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateJobRoleDto)
  jobRole?: CreateJobRoleDto;
}
