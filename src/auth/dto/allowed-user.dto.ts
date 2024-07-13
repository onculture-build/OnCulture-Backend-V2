import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AllowedUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
