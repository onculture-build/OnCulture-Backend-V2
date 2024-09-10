import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateJobRoleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  @IsOptional()
  jobLevelId?: string;
}
