import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { TeamSumUpModule } from './team-sum-up/team-sum-up.module';
import { ShoutOutModule } from './shout-out/shout-out.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  imports: [TeamSumUpModule, ShoutOutModule, FeedbackModule],
})
export class TemplateModule {}
