import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import {
  CreateEmployeeIntegration,
  IProcessEmployeeCsvUpload,
  ISendEmployeeSetupEmail,
  JOBS,
  QUEUE,
} from '../interfaces';
import { AssignCourseToEmployeesDto } from '../course/dto/assign-employee.dto';
import * as Sentry from '@sentry/node';
@Injectable()
export class CompanyUserQueueProducer {
  constructor(
    @InjectQueue(QUEUE)
    private readonly companyQueue: Queue,
  ) {}

  async processEmployeeCsvUpload(data: IProcessEmployeeCsvUpload) {
    await this.addToQueue(JOBS.PROCESS_EMPLOYEE_CSV_UPLOAD, data, {
      removeOnComplete: true,
    });
  }

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

  async addEmployeesToCourseSubscription(
    data: AssignCourseToEmployeesDto & { companyId: string },
  ) {
    Sentry.captureMessage("****QUEUEUE STARTED****",'info')
    await this.addToQueue(JOBS.ASSIGN_COURSE_TO_EMPLOYEES, data, {
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.companyQueue.add(jobName, data, opts);
  }
}
