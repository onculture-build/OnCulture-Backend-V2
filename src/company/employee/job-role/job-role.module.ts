import { Module } from '@nestjs/common';
import { JobRoleService } from './job-role.service';
import { JobRoleController } from './job-role.controller';

@Module({
  providers: [JobRoleService],
  exports: [JobRoleService],
  controllers: [JobRoleController],
})
export class JobRoleModule {}
