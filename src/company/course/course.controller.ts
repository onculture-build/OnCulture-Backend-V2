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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AssignEmployeeToCourseDto } from './dto/assign-employee.dto';
import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { EmployeeCourseService } from './employee/employee-course.service';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { GetCourseDto } from './dto/get-course .dto';

@ApiTags('Company Courses')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('company/courses')
export class CourseController {
  constructor(
    private courseService: CourseService,
    private employeeCourseService: EmployeeCourseService,
  ) {}

  @ApiOperation({
    summary: 'Get all the courses the company has subscribed to',
  })
  @Get()
  async getAllCompanyCourses(@Query() query: GetCourseDto) {
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

  @ApiOperation({ summary: 'Get all courses an employee is subscribed to' })
  @Get(':employeeId')
  async getAllEmployeeSubscribedCourses(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() query: PaginationSearchOptionsDto,
  ) {
    return this.employeeCourseService.getEmployeeCourses(employeeId, query);
  }

  @ApiOperation({ summary: 'Get a course an employee is subscribed to' })
  @Get(':courseSubId/employee')
  async getEmployeeSubscribedCourse(
    @Param('courseSubId', ParseUUIDPipe) id: string,
  ) {
    return this.employeeCourseService.getEmployeeCourse(id);
  }

  @ApiResponseMeta({ message: 'Lesson completed.' })
  @ApiOperation({ summary: 'Mark a lesson as complete' })
  @Patch(':courseSubId/:lessonId/complete')
  async completeLesson(
    @Param('courseSubId', ParseUUIDPipe) courseSubId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.employeeCourseService.completeLesson(courseSubId, lessonId);
  }

  @ApiOperation({ summary: 'Get a lesson' })
  @Get(':courseSubId/:lessonId/get-lesson')
  async getLesson(
    @Param('courseSubId', ParseUUIDPipe) courseSubId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.employeeCourseService.getLesson(courseSubId, lessonId);
  }
}
