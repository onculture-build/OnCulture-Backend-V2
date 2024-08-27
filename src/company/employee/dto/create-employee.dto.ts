import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateJobRoleDto } from '../job-role/dto/create-job-role.dto';
import { Type } from 'class-transformer';
import { EmploymentType } from '@@/company/interfaces';
import { SetupUserDto } from '@@/company/user/dto/setup-user.dto';

export class CreateEmployeeDto extends SetupUserDto {
  @IsString()
  employeeNo?: string;

  @IsUUID()
  departmentId?: string;

  @IsUUID()
  branchId?: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateJobRoleDto)
  jobRole?: CreateJobRoleDto;
}
