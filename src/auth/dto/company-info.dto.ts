import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { UploadLogoDto } from './upload-logo.dto';
import { Type } from 'class-transformer';

export class CompanyInfoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsEmail(undefined, { message: 'Company Email is Invalid!' })
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  address1: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  address2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  townCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  postCode?: string;

  @IsUUID()
  countryId: string;

  @IsUUID()
  stateId: string;

  @IsString()
  @IsOptional()
  mission?: string;

  @IsString()
  @IsOptional()
  vision?: string;

  @IsArray()
  @IsOptional()
  values?: string[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UploadLogoDto)
  logo?: UploadLogoDto;
}
