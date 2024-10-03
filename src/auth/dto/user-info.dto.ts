import { IsBirthDate } from '@@/common/decorators/is-birth-date';
import { Gender, MaritalStatus } from '@@/common/interfaces';
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
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
  @Expose({ name: 'First Name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Expose({ name: 'Middle Name' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @Expose({ name: 'Last Name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  maidenName?: string;

  @IsOptional()
  @IsString()
  formerNames?: string;

  @Expose({ name: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose({ name: 'Phone' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  phoneCountry?: string;

  @Expose({ name: 'Date of Birth' })
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

  @Expose({ name: 'Gender' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @Expose({ name: 'Marital Status' })
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
