import { PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from '@@/company/user/dto/update-user.dto';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { CreateJobRoleDto } from '../job-role/dto/create-job-role.dto';
import { CreateEmploymentTypeDto } from './create-employee-type.dto';

export class UpdateEmployeeDto extends PartialType(UpdateUserDto) {
  @IsString()
  @IsOptional()
  employeeNo?: string;

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
