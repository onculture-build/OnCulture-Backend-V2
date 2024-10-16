import { Module } from '@nestjs/common';
import { BaseCourseService } from './base-course.service';
import { BaseCourseController } from './base-course.controller';
import { SanityService } from './sanity/sanity.service';
import { SanityProviderService } from '@@/common/third-party/providers/sanity/sanity.service';

@Module({
  providers: [BaseCourseService, SanityService, SanityProviderService],
  controllers: [BaseCourseController],
})
export class BaseCourseModule {}
