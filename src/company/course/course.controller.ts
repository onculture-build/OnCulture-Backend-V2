import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AssignEmployeeToCourseDto } from './dto/assign-employee.dto';
import { RequestWithUser } from '@@/auth/interfaces';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';

@ApiTags('Company Courses')
@Controller('company/courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @ApiOperation({
    summary: 'Get all the courses the company has subscribed to',
  })
  @Get()
  async getAllCompanyCourses(@Query() query: PaginationSearchOptionsDto) {
    return this.courseService.getAllCompanyCourses(query);
  }

  @ApiResponseMeta({ message: 'Employee enrolled successfully' })
  @ApiOperation({ summary: 'Assign an employee to a course' })
  @Post('assign')
  async assignEmployeeToCourse(
    @Body() dto: AssignEmployeeToCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.courseService.assignEmployeeToCourse(dto, req);
  }
}
