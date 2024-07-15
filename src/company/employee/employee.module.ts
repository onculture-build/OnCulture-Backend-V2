import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JobRoleModule } from './job-role/job-role.module';
import { JobLevelModule } from './job-level/job-level.module';

@Module({
  providers: [EmployeeService],
  controllers: [EmployeeController],
  imports: [JobRoleModule, JobLevelModule]
})
export class EmployeeModule {}
