import { Module } from '@nestjs/common';
import { BaseCompanyModule } from './base-company/base-company.module';
import { BaseCountryModule } from './base-country/base-country.module';
import { BaseStateService } from './base-state/base-state.service';

@Module({
  imports: [BaseCompanyModule, BaseCountryModule],
  providers: [BaseStateService],
})
export class BaseModule {}
