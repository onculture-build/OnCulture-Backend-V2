import { OpenRoute } from '@@/common/decorators/route.decorator';
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseCourseService } from './base-course.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { SanityService } from './sanity/sanity.service';

@ApiTags('Base Courses')
@OpenRoute()
@Controller('courses')
export class BaseCourseController {
  constructor(
    private courseService: BaseCourseService,
    private sanityCourseService: SanityService,
  ) {}

  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  async getAllCourses(@Query() query: PaginationSearchOptionsDto) {
    return this.courseService.getAllCourses(query);
  }

  @ApiOperation({ summary: 'Get all courses from sanity' })
  @Get('sanity')
  async getAllSanityCourses(@Query() query: PaginationSearchOptionsDto) {
    return this.sanityCourseService.getAllCourses(query);
  }

  @Get(':id')
  async getCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseService.getCourse(id);
  }

  @Get('sanity/:id')
  async getSanityCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseService.getCourse(id);
  }
}
