import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { Type } from 'class-transformer';
import {
  IsUrl,
  IsOptional,
  IsObject,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { EmergencyContactDto } from './emergency-contact.dto';
import { EmployeeBankDto } from './employee-bank.dto';
import { NextOfKinDto } from './next-of-kin.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(UserInfoDto) {
  @IsUrl()
  @IsOptional()
  linkedInURL?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeBankDto)
  bank?: EmployeeBankDto;

  @IsEmail()
  @IsOptional()
  alternateEmail?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => NextOfKinDto)
  nextOfKin?: NextOfKinDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
}
