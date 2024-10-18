import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProviderMember } from '../../../common/third-party/interfaces';
import { Type } from 'class-transformer';

export class CreateEmployeeIntegrationDto implements ProviderMember {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export class IntegrationMemberDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeIntegrationDto)
  data: CreateEmployeeIntegrationDto[];

  @IsString()
  @IsNotEmpty()
  code: string;
}
