import { IsString } from 'class-validator';

export class GetCompanyDomainDto {
  @IsString()
  code: string;
}
