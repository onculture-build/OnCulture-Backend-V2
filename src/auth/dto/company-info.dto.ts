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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyInfoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  name: string;

  @IsEmail(undefined, { message: 'Tenant Email is Invalid!' })
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ApiProperty()
  address1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  address2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  townCity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postCode?: string;

  @IsUUID()
  @ApiProperty()
  countryId: string;

  @IsUUID()
  @ApiProperty()
  stateId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  mission?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  vision?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  values?: string[];

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => UploadLogoDto)
  logo?: UploadLogoDto;
}
