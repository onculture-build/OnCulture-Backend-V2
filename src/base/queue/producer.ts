import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {
  JOBS,
  IProcessOnboardCompany,
  ISendOnboardingEmail,
  QUEUE,
} from '../interfaces';

@Injectable()
export class BaseCompanyQueueProducer {
  constructor(@InjectQueue(QUEUE) private baseQueue: Queue) {}

  async sendOnboardingEmail(data: ISendOnboardingEmail) {
    await this.addToQueue(JOBS.SEND_ONBOARDING_EMAIL, data, {
      removeOnComplete: true,
    });
  }

  async processOnboardCompany(data: IProcessOnboardCompany) {
    await this.addToQueue(JOBS.PROCESS_ONBOARD_COMPANY, data, {
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.baseQueue.add(jobName, data, opts);
  }
}
