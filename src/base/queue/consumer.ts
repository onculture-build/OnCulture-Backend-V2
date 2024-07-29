import { Process, Processor } from '@nestjs/bull';
import { BaseQueueProcessor } from '@@/common/interfaces/base-queue';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { ConfigService } from '@nestjs/config';
import {
  QUEUE,
  JOBS,
  ISendOnboardingEmail,
  IProcessOnboardCompany,
} from '../interfaces';
import { BaseCompanyService } from '../base-company/base-company.service';
import { CompanyRequestStatus } from '@@/common/enums';

@Processor(QUEUE)
export class BaseCompanyQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;
  constructor(
    private companyService: BaseCompanyService,
    private config: ConfigService,
    private messagingService: MessagingService,
  ) {
    super();
    this.logger = new Logger('BaseCompanyQueueConsumer');
  }

  @Process({ name: JOBS.SEND_ONBOARDING_EMAIL })
  async processSendOnboardingEmail({ data }: Job<ISendOnboardingEmail>) {
    const { companyId, dto, password } = data;
    this.messagingService
      .sendCompanyOnboardingEmail(companyId, dto, password)
      .catch(console.error);
  }

  @Process({ name: JOBS.PROCESS_ONBOARD_COMPANY })
  async processOnboardCompany({ data }: Job<IProcessOnboardCompany>) {
    await this.companyService.activateCompany(data.companyId, {
      status: CompanyRequestStatus.Approved,
    });
  }
}
