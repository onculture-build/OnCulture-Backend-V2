import { EmployeeStatus } from '@@/common/enums';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { EmployeeOrderColumns } from '@@/company/interfaces';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetEmployeesDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsString()
  employeeNo?: string;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @IsArray()
  departments?: string[];

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @IsArray()
  employmentTypes?: string[];

  @IsOptional()
  @IsEnum(EmployeeStatus, { each: true })
  @IsArray()
  statuses?: EmployeeStatus[];

  @IsOptional()
  @IsEnum(EmployeeOrderColumns)
  orderBy?: EmployeeOrderColumns;
}
