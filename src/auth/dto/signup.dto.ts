import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { UserInfoDto } from './user-info.dto';
import { CompanyInfoDto } from './company-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  @ApiProperty()
  userInfo: UserInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  @ApiProperty()
  companyInfo: CompanyInfoDto;
}
