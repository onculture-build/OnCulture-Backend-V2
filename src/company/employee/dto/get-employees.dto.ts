import { EmployeeStatus } from '@@/common/enums';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { EmployeeOrderColumns, EmploymentType } from '@@/company/interfaces';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetEmployeesDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsString()
  employeeNo?: string;

  @IsOptional()
  @IsString()
  @IsArray()
  jobRoleIds?: string[];

  @IsOptional()
  @IsUUID()
  @IsArray()
  departmentIds?: string[];

  @IsEnum(EmploymentType)
  @IsOptional()
  @IsArray()
  employmentType?: EmploymentType[];

  @IsOptional()
  @IsEnum(EmployeeStatus)
  @IsArray()
  status?: EmployeeStatus[];

  @IsOptional()
  @IsEnum(EmployeeOrderColumns)
  orderBy?: EmployeeOrderColumns;
}
