import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

export class SetupUserDto {
  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;
}
