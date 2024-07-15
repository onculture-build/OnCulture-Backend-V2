import { Module } from '@nestjs/common';
import { BaseCompanyRequestModule } from './base-company-request/base-company-request.module';
import { BaseCompanyService } from './base-company.service';
import { BaseCompanyQueueProducer } from '../queue/producer';
import { BaseCompanyQueueConsumer } from '../queue/consumer';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { BaseCompanyRequestService } from './base-company-request/base-company-request.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../interfaces';
import { UserService } from '@@/company/user/user.service';
import { CompanyModule } from '@@/company/company.module';

@Module({
  imports: [
    BaseCompanyRequestModule,
    CompanyModule,
    BullModule.registerQueue({ name: QUEUE }),
  ],
  providers: [
    BaseCompanyService,
    BaseCompanyRequestService,
    BaseCompanyQueueProducer,
    BaseCompanyQueueConsumer,
    MessagingService,
    UserService,
  ],
  exports: [
    BaseCompanyService,
    BaseCompanyRequestService,
    BaseCompanyQueueProducer,
    BaseCompanyQueueConsumer,
  ],
})
export class BaseCompanyModule {}
