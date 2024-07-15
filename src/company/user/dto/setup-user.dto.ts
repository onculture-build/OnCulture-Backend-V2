import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { CreateEmployeeDto } from '@@/company/employee/dto/create-employee.dto';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

export class SetupUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateEmployeeDto)
  employeeInfo?: CreateEmployeeDto;
}
