import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobTimelineService } from './job-timeline.service';
import { CreateJobTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@ApiTags('Job Timelines')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('job-timeline')
export class JobTimelineController {
  constructor(private timelineService: JobTimelineService) {}

  @ApiOperation({ summary: 'Get timelines for all Employees' })
  @Get()
  async getAllEmployeesTimeline() {
    return this.timelineService.getAllTimelines;
  }

  @ApiOperation({ summary: 'Get a timeline' })
  @Get(':timelineId')
  async getTimeline(@Param('timelineId', ParseUUIDPipe) timelineId: string) {
    return this.timelineService.getTimeline(timelineId);
  }

  @ApiOperation({ summary: 'Create a timeline record for an employee' })
  @Post()
  async createTimeline(
    @Body() dto: CreateJobTimelineDto,
    @Req() req: RequestWithUser,
  ) {
    return this.timelineService.createTimeline(dto, req);
  }

  @ApiOperation({ summary: "Update an employee's timeline record" })
  @Patch(':timelineId')
  async updateEmployeeTimeline(
    @Param('timelineId') timelineId: string,
    @Body() dto: UpdateTimelineDto,
    @Req() req: RequestWithUser,
  ) {
    return this.timelineService.updateTimeline(timelineId, dto, req);
  }
}
