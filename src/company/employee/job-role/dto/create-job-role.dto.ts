import { IsOptional, IsString } from 'class-validator';

export class CreateJobRoleDto {

  @IsOptional()
  @IsString()
  id?: string;
  
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
