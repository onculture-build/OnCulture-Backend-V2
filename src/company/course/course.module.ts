import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EmployeeCourseService } from './employee/employee-course.service';
import { SanityProviderService } from '@@/common/third-party/providers/sanity/sanity.service';

@Module({
  providers: [CourseService, EmployeeCourseService, SanityProviderService],
  controllers: [CourseController],
})
export class CourseModule {}
