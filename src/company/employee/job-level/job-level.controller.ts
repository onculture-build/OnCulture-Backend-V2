import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { JobLevelService } from './job-level.service';
import { CreateJobLevelDto } from './dto/create-job-level.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { GetJobLevelsDto } from './dto/get-job-levels.dto';
import { UpdateJobLevelDto } from './dto/update-job-level.dto';

@ApiTags('Job Level')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('job-level')
export class JobLevelController {
  constructor(private jobLevelService: JobLevelService) {}

  @ApiOperation({ summary: 'Get all job levels' })
  @Get()
  async getJobLevels(@Query() dto: GetJobLevelsDto) {
    return this.jobLevelService.getAllJobLevels(dto);
  }

  @ApiOperation({ summary: 'Get a job level' })
  @Get(':id')
  async getAJobLevel(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobLevelService.getJobLevelById(id);
  }

  @ApiOperation({ summary: 'Create job level' })
  @ApiResponseMeta({ message: 'Job level created successfully!' })
  @Post()
  async createJobLevel(
    @Body() dto: CreateJobLevelDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobLevelService.createJobLevel(dto, req);
  }

  @ApiOperation({ summary: 'Update job level' })
  @ApiResponseMeta({ message: 'Job level updated successfully!' })
  @Patch(':id')
  async updateJobLevel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobLevelDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobLevelService.updateJobLevel(id, dto, req);
  }
}
