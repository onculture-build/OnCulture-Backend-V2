import { BaseQueueProcessor } from '@@common/interfaces/base-queue';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  CreateEmployeeIntegration,
  FileUploadStatus,
  IProcessEmployeeCsvUpload,
  ISendEmployeeSetupEmail,
  JOBS,
  QUEUE,
} from '../interfaces';
import { Job } from 'bull';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { EmployeeService } from '../employee/employee.service';
import { PrismaClient } from '@@prisma/company';
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import { AssignCourseToEmployeesDto } from '../course/dto/assign-employee.dto';
import { CourseService } from '../course/course.service';

@Processor(QUEUE)
export class CompanyUserQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(
    private messagingService: MessagingService,
    private employeeService: EmployeeService,
    private courseService: CourseService,
    private prismaClient: PrismaClient,
    private prismaClientManager: PrismaClientManager,
  ) {
    super();
    this.logger = new Logger('CompanyQueueConsumer');
  }

  @Process({ name: JOBS.PROCESS_EMPLOYEE_CSV_UPLOAD })
  async processEmployeeCsvUpload({ data }: Job<IProcessEmployeeCsvUpload>) {
    const { companyId, uploadId, records } = data;

    const prismaClient =
      this.prismaClientManager.getCompanyPrismaClient(companyId);

    const result = {};
    result['success'] = [];
    result['error'] = [];

    for (const record of records) {
      try {
        await this.employeeService.createEmployee(record, prismaClient);
        result['success'].push({ success: true, record });
      } catch (error) {
        this.logger.error(`Failed to create employee: ${error.message}`);
        result['error'].push({ success: false, record });
      }
    }

    this.logger.log(`Processed ${records.length} employee records`);

    const failedCount = result['error'].length;

    const uploadFailed = failedCount === records.length;

    let statusMessage = '';

    if (uploadFailed) {
      statusMessage = 'Upload failed';
    } else if (failedCount > 0) {
      statusMessage = `Uploaded ${result['success'].length} employees with ${failedCount} errors`;
    } else {
      statusMessage = 'Uploaded all employees successfully';
    }

    await prismaClient.fileUpload.update({
      where: { id: uploadId },
      data: {
        statusMessage,
        status: uploadFailed
          ? FileUploadStatus.Failed
          : FileUploadStatus.Completed,
      },
    });

    return result; // TODO: send an email to the user with the results
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

  @Process({ name: JOBS.ASSIGN_COURSE_TO_EMPLOYEES })
  async addEmployeesToCourse({
    data,
  }: Job<AssignCourseToEmployeesDto & { companyId: string }>) {
    this.courseService.assignCourseToEmployees(data);
  }
}
