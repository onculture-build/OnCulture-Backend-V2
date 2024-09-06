import { ArrayMinSize, IsArray, IsEmail } from 'class-validator';

export class CreateAllowedUserDto {
  @IsEmail({}, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  emails: string[];
}
