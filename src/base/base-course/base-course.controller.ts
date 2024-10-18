import { OpenRoute } from '@@/common/decorators/route.decorator';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseCourseService } from './base-course.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { SanityService } from './sanity/sanity.service';
import { RequestWithUser } from '@@/auth/interfaces';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';

@ApiTags('Base Courses')
@Controller('courses')
export class BaseCourseController {
  constructor(
    private courseService: BaseCourseService,
    private sanityCourseService: SanityService,
  ) {}

  @OpenRoute()
  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  async getAllCourses(@Query() query: PaginationSearchOptionsDto) {
    return this.courseService.getAllCourses(query);
  }

  @OpenRoute()
  @ApiOperation({ summary: 'Get all sanity courses' })
  @Get('sanity')
  async getAllSanityCourses(@Query() query: PaginationSearchOptionsDto) {
    return this.sanityCourseService.getAllCourses(query);
  }

  @OpenRoute()
  @ApiOperation({ summary: 'Get a course by id' })
  @Get(':id')
  async getCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseService.getCourse(id);
  }

  @OpenRoute()
  @ApiOperation({ summary: 'Get a sanity course by id' })
  @Get('sanity/:id')
  async getSanityCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.sanityCourseService.getCourse(id);
  }

  @ApiOperation({ summary: 'Subscribe to a sanity course' })
  @ApiResponseMeta({ message: 'Successfully subscribed to course' })
  @Post('sanity/:id/subscribe')
  async subscribeToSanityCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.sanityCourseService.subscribeToCourse(id, req);
  }
}
