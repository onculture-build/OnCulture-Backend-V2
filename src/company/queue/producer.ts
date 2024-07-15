import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import { ISendUserSetupEmail, JOBS, QUEUE } from '../interfaces';

@Injectable()
export class CompanyUserQueueProducer {
  constructor(
    @InjectQueue(QUEUE)
    private readonly companyQueue: Queue,
  ) {}

  async sendUserSetupEmail(data: ISendUserSetupEmail) {
    await this.addToQueue(JOBS.SEND_USER_SETUP_EMAIL, data, {
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.companyQueue.add(jobName, data, opts);
  }
}
