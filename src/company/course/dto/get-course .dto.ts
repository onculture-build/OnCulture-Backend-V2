import { IsOptional, IsUUID } from 'class-validator';
import { PaginationSearchOptionsDto } from '../../../common/interfaces/pagination-search-options.dto';

export class GetCourseDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsUUID()
  id?: string;
}
