import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJobLevelDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @ApiProperty()
  rank: number;
}
