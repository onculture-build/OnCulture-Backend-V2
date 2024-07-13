import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue, JobOptions } from 'bull';
import { JOBS, QUEUE } from '../interfaces';

@Injectable()
export class MessagingQueueProducer {
  constructor(
    @InjectQueue(QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  async sendEmail(data: any) {
    return this.smsQueue.add(JOBS.SEND_EMAIL, data, {
      removeOnComplete: true,
    });
  }

  async queueEmail(data: any) {
    return this.addToQueue(JOBS.QUEUE_EMAIL, data, {
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.smsQueue.add(jobName, data, opts);
  }
}
