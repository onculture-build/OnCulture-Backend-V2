import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../database/pagination.dto';

export class PaginationSearchOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsString()
  term?: string;
}
