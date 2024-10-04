import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IntegrationProviders } from '../../../common/third-party/interfaces';

export class InitIntegrationDto {
  @IsEnum(IntegrationProviders)
  @IsNotEmpty()
  type: IntegrationProviders;

  @IsString()
  @IsNotEmpty()
  companyCode: string;
}
