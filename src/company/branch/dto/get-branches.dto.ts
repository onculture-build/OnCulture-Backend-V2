import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { IsBooleanString } from 'class-validator';

export class GetBranchesDto extends PaginationSearchOptionsDto {
  @IsBooleanString()
  isDefault?: string;
}
