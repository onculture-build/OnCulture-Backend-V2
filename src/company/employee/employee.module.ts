import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JobRoleModule } from './job-role/job-role.module';
import { JobLevelModule } from './job-level/job-level.module';
import { JobRoleService } from './job-role/job-role.service';
import { UserModule } from '../user/user.module';
import { CsvModule } from './csv/csv.module';
import { EmploymentTypesService } from './employment-types/employment-types.service';
import { JobTimelineService } from './job-timeline/job-timeline.service';
import { JobTimelineController } from './job-timeline/job-timeline.controller';

@Module({
  providers: [EmployeeService, JobRoleService, EmploymentTypesService, JobTimelineService],
  controllers: [EmployeeController, JobTimelineController],
  imports: [JobRoleModule, JobLevelModule, UserModule, CsvModule],
  exports: [EmployeeService, EmploymentTypesService],
})
export class EmployeeModule {}
