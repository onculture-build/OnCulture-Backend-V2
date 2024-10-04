import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

export class SetupUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;
}
