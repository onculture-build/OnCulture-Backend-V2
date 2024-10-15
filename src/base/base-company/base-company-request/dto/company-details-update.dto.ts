import { CompanyRequestStatus, CompanyRequestAction } from '@@/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';


export class CreateCompanyValues {
    @IsOptional()
    @IsString()
    value: string;

    @IsOptional()
    @IsUUID()
    @IsString()
    id: string;
}
export class CompanyDetailsUpdateDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    website: string;

    @IsOptional()
    @IsString()
    townCity: string;

    @IsOptional()
    @IsString()
    overview: string;

    @IsOptional()
    @IsString()
    mission: string;

    @IsOptional()
    @IsString()
    vision: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true }) 
    @Type(() => CreateCompanyValues)  
    values: CreateCompanyValues[];
}
