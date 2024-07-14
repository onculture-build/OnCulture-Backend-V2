import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JOBS, QUEUE, QueueMailJobAttribs } from '../interfaces';
import { BaseQueueProcessor } from '@@/common/interfaces/base-queue';

@Processor(QUEUE)
export class MessagingQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor() {
    // slackWebhook: SlackWebhook, // private messageService: CoreMessageService,
    // super(slackWebhook);
    super();
    this.logger = new Logger('MessagingQueueConsumer');
  }

  @Process({ name: JOBS.QUEUE_EMAIL })
  async queueEmail({ data }: Job<QueueMailJobAttribs>) {
    console.log('Sending email...');

    // return this.messageService.sendEmail(data);
  }
}
