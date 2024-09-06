import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindAllowedUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
