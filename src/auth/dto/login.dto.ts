import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ValidateIf((obj, val) => !!val || !obj.employeeNo)
  email?: string;

  @IsString()
  @ValidateIf((obj, val) => !!val || !obj.email)
  employeeNo?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
