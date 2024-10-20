import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EmployeeCourseService } from './employee/employee-course.service';
import { SanityProviderService } from '@@/common/third-party/providers/sanity/sanity.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../interfaces';
import { CompanyUserQueueProducer } from '../queue/producer';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE })],
  providers: [
    CourseService,
    EmployeeCourseService,
    SanityProviderService,
    CompanyUserQueueProducer,
  ],
  controllers: [CourseController],
})
export class CourseModule {}
