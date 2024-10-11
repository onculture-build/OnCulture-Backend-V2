import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from '@@/company/user/dto/update-user.dto';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends IntersectionType(
  PartialType(UpdateUserDto),
  PartialType(CreateEmployeeDto),
) {}
