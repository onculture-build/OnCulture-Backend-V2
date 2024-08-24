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

export class CreateEmployeeDto {
  @IsString()
  @ApiProperty()
  employeeNo: string;

  @IsUUID()
  @ApiPropertyOptional()
  departmentId?: string;

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
