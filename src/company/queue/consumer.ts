import { BaseQueueProcessor } from '@@common/interfaces/base-queue';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ISendUserSetupEmail, JOBS, QUEUE } from '../interfaces';
import { Job } from 'bull';
import { MessagingService } from '@@/common/messaging/messaging.service';

@Processor(QUEUE)
export class CompanyUserQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(private messagingService: MessagingService) {
    super();
    this.logger = new Logger('CompanyQueueConsumer');
  }

  @Process({ name: JOBS.SEND_USER_SETUP_EMAIL })
  async sendUserSetupEmail({ data }: Job<ISendUserSetupEmail>) {
    const { companyId, dto, password } = data;
    this.messagingService.sendUserSetupEmail(companyId, dto, password);
  }
}
