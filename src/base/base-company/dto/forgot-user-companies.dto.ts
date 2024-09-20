import { IsEmail } from 'class-validator';

export class ForgotUserCompaniesDto {
  @IsEmail()
  email: string;
}
