import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional()
  employeeNo?: string;

  @IsUUID()
  @ApiPropertyOptional()
  departmentId?: string;

  @IsUUID()
  @ApiPropertyOptional()
  branchId?: string;

  @IsEnum(EmploymentType)
  @ApiProperty()
  employmentType: EmploymentType;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreateJobRoleDto)
  jobRole?: CreateJobRoleDto;
}
