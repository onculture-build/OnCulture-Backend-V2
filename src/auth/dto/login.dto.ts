import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ValidateIf((obj, val) => !!val || (!obj.companyCode && !obj.employeeNo))
  @ApiProperty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  companyCode?: string;

  @IsString()
  @ValidateIf((obj, val) => !!val || !obj.companyCode)
  @ApiPropertyOptional()
  employeeNo?: string;
}
