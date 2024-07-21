import { Module } from '@nestjs/common';
import { JobLevelService } from './job-level.service';
import { JobLevelController } from './job-level.controller';

@Module({
  providers: [JobLevelService],
  controllers: [JobLevelController],
  exports: [JobLevelService],
})
export class JobLevelModule {}
