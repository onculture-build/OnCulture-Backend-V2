import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @ApiProperty()
  employeeNo: string;

  @IsUUID()
  @ApiProperty()
  jobRoleId: string;
}
