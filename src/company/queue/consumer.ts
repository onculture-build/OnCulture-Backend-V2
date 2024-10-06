import { BaseQueueProcessor } from '@@common/interfaces/base-queue';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  CreateEmployeeIntegration,
  ISendEmployeeSetupEmail,
  JOBS,
  QUEUE,
} from '../interfaces';
import { Job } from 'bull';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { EmployeeService } from '../employee/employee.service';

@Processor(QUEUE)
export class CompanyUserQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(
    private messagingService: MessagingService,
    private employeeService: EmployeeService,
  ) {
    super();
    this.logger = new Logger('CompanyQueueConsumer');
  }

  @Process({ name: JOBS.SEND_EMPLOYEE_SETUP_EMAIL })
  async sendEmployeeSetupEmail({ data }: Job<ISendEmployeeSetupEmail>) {
    const { code, dto, token } = data;
    this.messagingService.sendUserSetupEmail(code, dto, token);
  }

  @Process({ name: JOBS.CREATE_EMPLOYEES_BULK })
  async createEmployeeFromIntegration({
    data,
  }: Job<CreateEmployeeIntegration>) {
    this.employeeService.createEmployeesFromIntegration(data);
  }
}
