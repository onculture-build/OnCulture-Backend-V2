import { Process, Processor } from '@nestjs/bull';
import { BaseQueueProcessor } from '@@/common/interfaces/base-queue';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { ConfigService } from '@nestjs/config';
import { QUEUE, JOBS, ISendOnboardingEmail } from '../interfaces';

@Processor(QUEUE)
export class BaseCompanyQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;
  constructor(
    private messagingService: MessagingService,
    private config: ConfigService,
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
}
