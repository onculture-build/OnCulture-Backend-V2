import { Exclude, Expose } from 'class-transformer';
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
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  stateId: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  apartmentBuilding?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  address1: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address2?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  townCity?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  postCode?: string;

  @Expose()
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @Expose()
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  logoId?: string;
}
