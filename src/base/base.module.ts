import { Module } from '@nestjs/common';
import { BaseCompanyModule } from './base-company/base-company.module';
import { BaseCountryModule } from './base-country/base-country.module';
import { BaseStateService } from './base-state/base-state.service';
import { BaseCourseModule } from './base-course/base-course.module';

@Module({
  imports: [BaseCompanyModule, BaseCountryModule, BaseCourseModule],
  providers: [BaseStateService],
})
export class BaseModule {}
