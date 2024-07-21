import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JobRoleModule } from './job-role/job-role.module';
import { JobLevelModule } from './job-level/job-level.module';
import { JobRoleService } from './job-role/job-role.service';

@Module({
  providers: [EmployeeService, JobRoleService],
  controllers: [EmployeeController],
  imports: [JobRoleModule, JobLevelModule],
  exports: [EmployeeService],
})
export class EmployeeModule {}
