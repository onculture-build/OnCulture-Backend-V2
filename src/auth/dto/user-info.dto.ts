import { IsBirthDate } from '@@/common/decorators/is-birth-date';
import { Gender, MaritalStatus } from '@@/common/interfaces';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsISO31661Alpha2,
  IsDate,
  IsEnum,
  IsUUID,
} from 'class-validator';

export class UserInfoDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  maidenName?: string;

  @IsOptional()
  @IsString()
  formerNames?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  phoneCountry?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @IsBirthDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsUUID()
  @IsOptional()
  countryId?: string;

  @IsUUID()
  @IsOptional()
  stateId?: string;

  @IsUUID()
  @IsOptional()
  @ApiHideProperty()
  roleId?: string;
}
