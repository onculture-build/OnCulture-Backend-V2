import { Body, Controller, Post } from '@nestjs/common';
import { JobLevelService } from './job-level.service';
import { CreateJobLevelDto } from './dto/create-job-level.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AuthStrategyType } from '@@/auth/interfaces';

@ApiTags('Job Level')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('job-level')
export class JobLevelController {
  constructor(private jobLevelService: JobLevelService) {}

  @ApiOperation({ summary: 'Create job levels' })
  @ApiResponseMeta({ message: 'Job level created successfully!' })
  @Post()
  async createJobLevel(@Body() dto: CreateJobLevelDto) {
    return this.jobLevelService.createJobLevel(dto);
  }
}
