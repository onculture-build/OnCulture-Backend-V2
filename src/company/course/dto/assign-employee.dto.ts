import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignEmployeeToCourseDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  subscriptionId: string;
}


export class AssignCourseToEmployeesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  employeeIds: string[]

  @IsUUID()
  subscriptionId: string;

  @IsNotEmpty()
  @IsString()
  code: string
}