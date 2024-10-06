import { IsOptional, IsString } from 'class-validator';

export class FieldTypeQueryDto {
  @IsOptional()
  @IsString()
  term?: string;
}
