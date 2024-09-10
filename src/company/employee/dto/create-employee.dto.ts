import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateJobRoleDto } from '../job-role/dto/create-job-role.dto';
import { Type } from 'class-transformer';
import { EmploymentType } from '@@/company/interfaces';
import { SetupUserDto } from '@@/company/user/dto/setup-user.dto';

export class CreateEmployeeDto extends SetupUserDto {
  @IsString()
  @IsOptional()
  employeeNo?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

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
