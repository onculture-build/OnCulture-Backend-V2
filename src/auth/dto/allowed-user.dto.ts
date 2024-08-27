import { IsEmail, IsNotEmpty } from 'class-validator';

export class AllowedUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
