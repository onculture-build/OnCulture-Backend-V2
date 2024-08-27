import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { UserInfoDto } from './user-info.dto';
import { CompanyInfoDto } from './company-info.dto';

export class SignUpDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  companyInfo: CompanyInfoDto;
}
