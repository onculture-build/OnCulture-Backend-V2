import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmployeeBankDto {
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsOptional()
  @IsString()
  swiftCode?: string;
}
