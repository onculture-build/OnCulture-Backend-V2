import { IsOptional, IsString } from 'class-validator';

export class CreateEmploymentTypeDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
