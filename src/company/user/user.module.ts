import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../interfaces';
import { CompanyUserQueueConsumer } from '../queue/consumer';
import { CompanyUserQueueProducer } from '../queue/producer';
import { EmployeeService } from '../employee/employee.service';
import { JobRoleService } from '../employee/job-role/job-role.service';
import { UserController } from './user.controller';
import { EmploymentTypesService } from '../employee/employment-types/employment-types.service';
import { UserRolesService } from './user-roles/user-roles.service';
import { CourseService } from '../course/course.service';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE })],
  providers: [
    EmployeeService,
    EmploymentTypesService,
    JobRoleService,
    UserService,
    CompanyUserQueueProducer,
    CompanyUserQueueConsumer,
    UserRolesService,
    CourseService,
  ],
  exports: [UserService, CompanyUserQueueProducer, CompanyUserQueueConsumer],
  controllers: [UserController],
})
export class UserModule {}
