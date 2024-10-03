import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

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
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  address1?: string;

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
  @IsOptional()
  countryId?: string;

  @IsUUID()
  @IsOptional()
  stateId?: string;

  @IsString()
  @IsOptional()
  mission?: string;
  @IsOptional()
  @IsString()
  @IsOptional()
  vision?: string;

  @IsArray()
  @IsOptional()
  values?: CompanyValue[];
}

class CompanyValue {
  @IsString()
  value: string;
}
