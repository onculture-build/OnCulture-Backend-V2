import { Module } from '@nestjs/common';
import { BaseCompanyModule } from './base-company/base-company.module';

@Module({
  imports: [BaseCompanyModule],
})
export class BaseModule {}
