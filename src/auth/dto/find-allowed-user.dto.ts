import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FindAllowedUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
