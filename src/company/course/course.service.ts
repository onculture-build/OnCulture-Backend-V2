import { CrudService } from '@@/common/database/crud.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
  PrismaClient as CompanyPrismaClient,
  Prisma as CompanyPrisma,
  CourseSubscription,
} from '.prisma/company';
import { CourseSubscriptionMapType } from './course.maptype';
import { PrismaClient } from '@prisma/client';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { AssignEmployeeToCourseDto } from './dto/assign-employee.dto';
import { RequestWithUser } from '@@/auth/interfaces';

@Injectable()
export class CourseService extends CrudService<
  CompanyPrisma.CourseSubscriptionDelegate,
  CourseSubscriptionMapType
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private basePrismaClient: PrismaClient,
  ) {
    super(prismaClient.courseSubscription);
  }

  async getAllCompanyCourses(query: PaginationSearchOptionsDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = query;

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'title',
      'author',
    ]);

    const args: CompanyPrisma.CourseSubscriptionFindManyArgs = {
      where: { ...parsedQueryFilters },
    };

    const dataMapperFn = async (data) => {
      return await this.getCourseDetails(data);
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

  async assignEmployeeToCourse(
    { employeeId, subscriptionId }: AssignEmployeeToCourseDto,
    req: RequestWithUser,
  ) {
    const subscription = await this.findFirst({
      where: { id: subscriptionId },
    });

    if (!subscription)
      throw new NotAcceptableException('Unable to get subscription');

    const existingSubscription =
      await this.prismaClient.employeeCourseSubscription.findUnique({
        where: {
          employeeId_courseSubscriptionId: {
            employeeId,
            courseSubscriptionId: subscriptionId,
          },
        },
      });

    if (existingSubscription)
      throw new NotAcceptableException('Employee already subscribed to course');

    return this.prismaClient.$transaction(
      async (prisma: CompanyPrismaClient) => {
        const employeeSub = await prisma.employeeCourseSubscription.create({
          data: {
            employee: { connect: { id: employeeId } },
            subscription: { connect: { id: subscriptionId } },
            createdBy: req.user?.userId,
          },
        });

        const { course } = await this.getCourseDetails(subscription);

        await prisma.employeeCourseProgress.create({
          data: {
            employeeSubscriptionId: employeeSub.id,
            progress: course.modules,
            createdBy: req.user?.userId,
          },
        });
      },
    );
  }

  async getCourseDetails(
    data: CourseSubscription,
  ): Promise<CourseSubscription & { course: any }> {
    let subscription;

    if (data.isSanityCourse) {
      subscription =
        await this.basePrismaClient.sanityCourseSubscription.findFirst({
          where: { id: data.subscriptionId },
          include: {
            course: true,
          },
        });
    } else {
      subscription =
        await this.basePrismaClient.baseCompanyCourseSubscription.findFirst({
          where: { id: data.subscriptionId },
          include: {
            course: true,
          },
        });
    }

    return { ...data, course: subscription?.course };
  }
}
