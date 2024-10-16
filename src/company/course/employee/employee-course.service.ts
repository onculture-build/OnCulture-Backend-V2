import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PrismaClient as CompanyPrismaClient,
  Prisma as CompanyPrisma,
} from '.prisma/company';
import { CrudService } from '@@/common/database/crud.service';
import { EmployeeCourseSubscriptionMapType } from './employee-course.maptype';
import { CourseService } from '../course.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { SanityProviderService } from '@@/common/third-party/providers/sanity/sanity.service';

@Injectable()
export class EmployeeCourseService extends CrudService<
  CompanyPrisma.EmployeeCourseSubscriptionDelegate,
  EmployeeCourseSubscriptionMapType
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private courseService: CourseService,
    private sanityProvider: SanityProviderService,
  ) {
    super(prismaClient.employeeCourseSubscription);
  }

  async getEmployeeCourses(
    employeeId: string,
    query: PaginationSearchOptionsDto,
  ) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = query;

    const parsedQueryFilters = this.parseQueryFilter(filters, []);

    const args: CompanyPrisma.EmployeeCourseSubscriptionFindManyArgs = {
      where: { employeeId, ...parsedQueryFilters },
      include: { subscription: true },
    };

    const dataMapperFn = async (data) => {
      console.log('🚀 ~ dataMapperFn ~ data:', data);
      const result = await this.courseService.getCourseDetails(
        data.subscription,
      );

      const progress = await this.prismaClient.employeeCourseProgress.findFirst(
        {
          where: {
            employeeSubscriptionId: data.id,
          },
        },
      );
      console.log('🚀 ~ dataMapperFn ~ progress:', progress);

      const completionData = this.calculateCompletionPercentage(
        progress.progress,
      );

      return { ...data, course: result, completionData };
    };

    return this.findManyPaginate(
      args,
      {
        cursor,
        size,
        direction,
        orderBy: orderBy && AppUtilities.unflatten({ [orderBy]: direction }),
        paginationType,
        page,
      },
      dataMapperFn,
    );
  }

  async getEmployeeCourse(courseSubscriptionId: string) {
    const subscription = await this.findFirst({
      where: { id: courseSubscriptionId },
      include: { subscription: true },
    });

    if (!subscription) {
      throw new NotFoundException('Course subscription not found');
    }

    const { progress } =
      await this.prismaClient.employeeCourseProgress.findFirst({
        where: { employeeSubscriptionId: courseSubscriptionId },
      });

    const initialLessonId = progress?.[0]?.lessons[0]?.id;

    const query = `*[_type == "lesson" && _id == "${initialLessonId}"]`;

    const initialContent = await this.sanityProvider.getContent(query);

    return { outline: progress, content: initialContent };
  }

  async getLesson(lessonId: string) {
    const query = `*[_type == "lesson" || _type == "quiz" && _id == "${lessonId}"]`;

    const content = await this.sanityProvider.getContent(query);

    return content;
  }

  async completeLesson(courseSubscriptionId: string, lessonId: string) {
    const subscription = await this.findFirst({
      where: { id: courseSubscriptionId },
      include: { subscription: true },
    });

    if (!subscription) {
      throw new NotFoundException('Course subscription not found');
    }

    const employeeProgress =
      await this.prismaClient.employeeCourseProgress.findFirst({
        where: { employeeSubscriptionId: courseSubscriptionId },
      });

    const updatedProgress = (employeeProgress.progress as any[]).map((item) => {
      const matchedLesson = item.lessons.find(
        (lesson) => lesson.id === lessonId,
      );

      if (matchedLesson) {
        matchedLesson.completed = true;
      }

      return item;
    });

    return this.prismaClient.employeeCourseProgress.update({
      where: { id: employeeProgress.id },
      data: {
        progress: updatedProgress,
      },
    });
  }

  private calculateCompletionPercentage(data: any): any {
    let totalCourseLessons = 0;
    let totalCourseCompletedLessons = 0;

    const moduleCompletion = data.map((mod) => {
      const totalLessons = mod.lessons.length;
      const completedLessons = mod.lessons.filter(
        (lesson) => lesson.completed,
      ).length;

      totalCourseLessons += totalLessons;
      totalCourseCompletedLessons += completedLessons;

      const completionPercentage =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        moduleName: mod.moduleName,
        moduleTitle: mod.moduleTitle,
        totalLessons,
        completedLessons,
        completionPercentage: completionPercentage.toFixed(2),
      };
    });

    const overallCompletionPercentage =
      totalCourseLessons > 0
        ? (totalCourseCompletedLessons / totalCourseLessons) * 100
        : 0;

    return {
      modules: moduleCompletion,
      overallCompletionPercentage: overallCompletionPercentage.toFixed(2),
    };
  }
}
