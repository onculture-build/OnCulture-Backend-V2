import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ValidateIf((obj, val) => !!val || !obj.employeeNo)
  @ApiProperty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @ValidateIf((obj, val) => !!val || !obj.email)
  @ApiPropertyOptional()
  employeeNo?: string;
}
