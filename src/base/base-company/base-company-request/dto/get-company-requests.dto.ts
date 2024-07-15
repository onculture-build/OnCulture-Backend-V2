import { CompanyRequestStatus } from '@@/common/enums';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { IsOptional, IsEnum } from 'class-validator';

export class GetCompanyRequestsDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsEnum(CompanyRequestStatus)
  status?: CompanyRequestStatus;
}
