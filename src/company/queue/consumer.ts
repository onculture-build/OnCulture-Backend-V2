import { BaseQueueProcessor } from '@@common/interfaces/base-queue';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ISendEmployeeSetupEmail, JOBS, QUEUE } from '../interfaces';
import { Job } from 'bull';
import { MessagingService } from '@@/common/messaging/messaging.service';

@Processor(QUEUE)
export class CompanyUserQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(private messagingService: MessagingService) {
    super();
    this.logger = new Logger('CompanyQueueConsumer');
  }

  @Process({ name: JOBS.SEND_EMPLOYEE_SETUP_EMAIL })
  async sendEmployeeSetupEmail({ data }: Job<ISendEmployeeSetupEmail>) {
    const { code, dto } = data;
    this.messagingService.sendUserSetupEmail(code, dto);
  }
}
