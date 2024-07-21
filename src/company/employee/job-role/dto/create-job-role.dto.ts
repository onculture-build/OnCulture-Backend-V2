import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateJobRoleDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description?: string;

  @IsUUID()
  @ApiProperty()
  jobLevelId: string;
}
