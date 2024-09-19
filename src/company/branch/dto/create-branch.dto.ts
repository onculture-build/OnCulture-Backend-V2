import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@Exclude()
export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsString()
  @IsOptional()
  countryId?: string;

  @IsString()
  @IsOptional()
  stateId?: string;

  @IsString()
  @IsOptional()
  apartmentBuilding?: string;

  @IsString()
  @IsOptional()
  address1?: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsOptional()
  townCity?: string;

  @IsString()
  @IsOptional()
  postCode?: string;

  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsString()
  @IsOptional()
  logoId?: string;
}
