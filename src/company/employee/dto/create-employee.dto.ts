import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateJobRoleDto } from '../job-role/dto/create-job-role.dto';
import { Expose, Type } from 'class-transformer';
import { SetupUserDto } from '@@/company/user/dto/setup-user.dto';
import { CreateEmploymentTypeDto } from './create-employee-type.dto';
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateEmployeeDto extends SetupUserDto {
  @Expose({ name: 'Employee No' })
  @IsString()
  @IsOptional()
  employeeNo?: string;

  @ApiHideProperty()
  @Expose({ name: 'Department Code' })
  @IsString()
  @IsOptional()
  departmentCode?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @Expose({ name: 'Branch Id' })
  @IsUUID()
  @IsOptional()
  branchId?: string;

  @Expose({ name: 'Employment Type Id' })
  @IsUUID()
  @IsOptional()
  employmentTypeId?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmploymentTypeDto)
  employmentType?: CreateEmploymentTypeDto;

  @Expose({ name: 'Job Role Id' })
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
