import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { JobLevelService } from './job-level.service';
import { CreateJobLevelDto } from './dto/create-job-level.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AuthStrategyType } from '@@/auth/interfaces';
import { GetJobLevelsDto } from './dto/get-job-levels.dto';

@ApiTags('Job Level')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('job-level')
export class JobLevelController {
  constructor(private jobLevelService: JobLevelService) {}

  @ApiOperation({ summary: 'Get all job levels' })
  @Get()
  async getJobLevels(@Query() dto: GetJobLevelsDto) {
    return dto;
  }

  @ApiOperation({ summary: 'Get a job level' })
  @Get(':id')
  async getAJobLevel(@Param('id', ParseUUIDPipe) id: string) {
    return id;
  }

  @ApiOperation({ summary: 'Create job level' })
  @ApiResponseMeta({ message: 'Job level created successfully!' })
  @Post()
  async createJobLevel(@Body() dto: CreateJobLevelDto) {
    return this.jobLevelService.createJobLevel(dto);
  }
}
