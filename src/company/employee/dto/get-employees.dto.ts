import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { EmploymentType } from '@@/company/interfaces';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetEmployeesDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsString()
  employeeNo?: string;

  @IsOptional()
  @IsString()
  jobRoleId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;
}
