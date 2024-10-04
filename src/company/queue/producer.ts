import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import {
  CreateEmployeeIntegration,
  ISendEmployeeSetupEmail,
  JOBS,
  QUEUE,
} from '../interfaces';

@Injectable()
export class CompanyUserQueueProducer {
  constructor(
    @InjectQueue(QUEUE)
    private readonly companyQueue: Queue,
  ) {}

  async sendEmployeeSetupEmail(data: ISendEmployeeSetupEmail) {
    await this.addToQueue(JOBS.SEND_EMPLOYEE_SETUP_EMAIL, data, {
      removeOnComplete: true,
    });
  }

  async inviteEmployeeToCompany(data: CreateEmployeeIntegration) {
    await this.addToQueue(JOBS.CREATE_EMPLOYEES_BULK, data, {
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.companyQueue.add(jobName, data, opts);
  }
}
