import { Module } from '@nestjs/common';
import { JobRoleService } from './job-role.service';

@Module({
  providers: [JobRoleService],
  exports: [JobRoleService],
})
export class JobRoleModule {}
