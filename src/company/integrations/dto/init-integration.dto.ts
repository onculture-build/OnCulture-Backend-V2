import { IsEnum, IsNotEmpty } from 'class-validator';
import { IntegrationProviders } from '../../../common/third-party/interfaces';

export class InitIntegrationDto {
  @IsEnum(IntegrationProviders)
  @IsNotEmpty()
  type: IntegrationProviders;
}
