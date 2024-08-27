import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ValidateIf((obj, val) => !!val || !obj.employeeNo)
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @ValidateIf((obj, val) => !!val || !obj.email)
  employeeNo?: string;
}
