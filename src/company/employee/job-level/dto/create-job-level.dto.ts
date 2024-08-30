import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateJobLevelDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  rank: number;
}
