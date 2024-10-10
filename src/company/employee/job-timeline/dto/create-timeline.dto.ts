import { IsOptional, IsUUID } from 'class-validator';

export class CreateJobTimelineDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsUUID()
  jobRoleId: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  levelId: string;

  @IsUUID()
  employmentTypeId: string;
}
