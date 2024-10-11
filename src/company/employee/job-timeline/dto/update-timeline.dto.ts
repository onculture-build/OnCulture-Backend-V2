import { PartialType } from '@nestjs/swagger';
import { CreateJobTimelineDto } from './create-timeline.dto';

export class UpdateTimelineDto extends PartialType(CreateJobTimelineDto) {}
