import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJobLevelDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  rank: number;
}
