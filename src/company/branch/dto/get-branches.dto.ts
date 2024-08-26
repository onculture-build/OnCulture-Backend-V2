import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString } from 'class-validator';

export class GetBranchesDto extends PaginationSearchOptionsDto {
  @ApiPropertyOptional()
  @IsBooleanString()
  isDefault?: string;
}
