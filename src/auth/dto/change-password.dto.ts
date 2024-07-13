import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}
