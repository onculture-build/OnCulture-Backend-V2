import { IsUUID } from 'class-validator';

export class AssignEmployeeToCourseDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  subscriptionId: string;
}
