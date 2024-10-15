import { IsOptional, IsString } from 'class-validator';

export class CreateJobRoleDto {
  
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
