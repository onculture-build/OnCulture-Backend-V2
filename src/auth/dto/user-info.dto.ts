import { IsBirthDate } from '@@/common/decorators/is-birth-date';
import { Gender } from '@@/common/interfaces';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
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
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  middleName?: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  maidenName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  formerNames?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional()
  phone?: string;

  @IsISO31661Alpha2()
  @IsOptional()
  @ApiPropertyOptional()
  phoneCountry?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @IsBirthDate()
  @ApiPropertyOptional()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  prefix?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  suffix?: string;

  @IsEnum(Gender)
  @IsOptional()
  @ApiPropertyOptional()
  gender?: Gender;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  preferredLanguage?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  countryId?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  stateId?: string;

  @IsUUID()
  @IsOptional()
  @ApiHideProperty()
  roleId?: string;
}
