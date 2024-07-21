import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../interfaces';
import { CompanyUserQueueConsumer } from '../queue/consumer';
import { CompanyUserQueueProducer } from '../queue/producer';
import { EmployeeService } from '../employee/employee.service';
import { JobRoleService } from '../employee/job-role/job-role.service';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE })],
  providers: [
    EmployeeService,
    JobRoleService,
    UserService,
    CompanyUserQueueProducer,
    CompanyUserQueueConsumer,
  ],
  exports: [UserService, CompanyUserQueueProducer, CompanyUserQueueConsumer],
})
export class UserModule {}
