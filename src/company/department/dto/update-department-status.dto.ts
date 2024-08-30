import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDepartmentStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
