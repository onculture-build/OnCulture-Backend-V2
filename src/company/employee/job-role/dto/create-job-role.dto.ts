import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateJobRoleDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description?: string;
}
