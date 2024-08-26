import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetEmployeesDto extends PaginationSearchOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobRoleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;
}
