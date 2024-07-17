import { Module } from '@nestjs/common';
import { BaseCompanyRequestService } from './base-company-request.service';

@Module({
  providers: [BaseCompanyRequestService],
})
export class BaseCompanyRequestModule {}
