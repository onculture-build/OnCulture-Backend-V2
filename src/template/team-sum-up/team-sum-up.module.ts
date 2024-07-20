import { Module } from '@nestjs/common';
import { TeamSumUpService } from './team-sum-up.service';


@Module({
  providers: [TeamSumUpService],
})
export class TeamSumUpModule {}
