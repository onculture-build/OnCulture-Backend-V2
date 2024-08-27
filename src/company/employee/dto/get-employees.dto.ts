import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { IsOptional, IsString } from 'class-validator';

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
}
