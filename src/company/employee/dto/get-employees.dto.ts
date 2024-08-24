import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetEmployeesDto extends PaginationSearchOptionsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  employeeNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  jobRoleId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  departmentId?: string;
}
