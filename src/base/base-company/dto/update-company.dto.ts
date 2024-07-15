import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
