import {
  IsDateString,
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
import { CreateJobLevelDto } from '../job-level/dto/create-job-level.dto';

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

  @IsUUID()
  @IsOptional()
  @ValidateIf((obj) => !obj.jobLevel)
  jobLevelId?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateJobLevelDto)
  jobLevel?: CreateJobLevelDto;

  @IsDateString()
  @IsOptional()
  joinDate?: Date;

  @IsDateString()
  @IsOptional()
  exitDate?: Date;
}
