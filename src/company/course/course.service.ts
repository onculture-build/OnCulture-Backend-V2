import { CrudService } from '@@/common/database/crud.service';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
  PrismaClient as CompanyPrismaClient,
  Prisma as CompanyPrisma,
  CourseSubscription,
} from '.prisma/company';
import { CourseSubscriptionMapType } from './course.maptype';
import { PrismaClient } from '@prisma/client';
import { AppUtilities } from '@@/common/utils/app.utilities';
import {
  AssignCourseToEmployeesDto,
  AssignEmployeeToCourseDto,
} from './dto/assign-employee.dto';
import { RequestWithUser } from '@@/auth/interfaces';
import { GetCourseDto } from './dto/get-course .dto';
import { CompanyUserQueueProducer } from '../queue/producer';
import { PrismaClientManager } from '../../common/database/prisma-client-manager';

@Injectable()
export class CourseService extends CrudService<
  CompanyPrisma.CourseSubscriptionDelegate,
  CourseSubscriptionMapType
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private basePrismaClient: PrismaClient,
    private companyQueueProducer: CompanyUserQueueProducer,
    private prismaClientManager: PrismaClientManager,
  ) {
    super(prismaClient.courseSubscription);
  }

  async getAllCompanyCourses(query: GetCourseDto) {
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
    client = this.prismaClient,
    req?: RequestWithUser,
  ) {
    const subscription = await client.courseSubscription.findFirst({
      where: { id: subscriptionId },
    });

    if (!subscription)
      throw new NotAcceptableException('Unable to get subscription');

    const existingSubscription =
      await client.employeeCourseSubscription.findUnique({
        where: {
          employeeId_courseSubscriptionId: {
            employeeId,
            courseSubscriptionId: subscriptionId,
          },
        },
      });

    if (existingSubscription)
      throw new NotAcceptableException('Employee already subscribed to course');

    return client.$transaction(async (prisma: CompanyPrismaClient) => {
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
    });
  }

  async getCourseDetails(
    data: CourseSubscription,
  ): Promise<
    CourseSubscription & { course: any; count: number; employees: any }
  > {
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

    const employees =
      await this.prismaClient.employeeCourseSubscription.findMany({
        where: {
          courseSubscriptionId: data.id,
        },
        include: {
          employee: true,
        },
      });

    const mapEmployees = await Promise.all(
      employees.map(async (employee) => {
        const { employee: assignedEmployees, ...others } = employee;
        const findResult = await this.prismaClient.user.findUnique({
          where: {
            id: assignedEmployees?.userId,
          },
          include: {
            emails: true,
            role: true,
          },
        });

        return { ...findResult, ...others };
      }),
    );

    return {
      ...data,
      course: subscription?.course,
      count: employees.length,
      employees: mapEmployees,
    };
  }

  async initAssignCourseToEmployees(data: AssignCourseToEmployeesDto) {
    const company = await this.basePrismaClient.baseCompany.findUnique({
      where: {
        code: data.code,
      },
    });
    return await this.companyQueueProducer.addEmployeesToCourseSubscription({
      ...data,
      companyId: company?.id,
    });
  }

  async assignCourseToEmployees(
    data: AssignCourseToEmployeesDto & { companyId: string },
  ) {
    const { companyId, subscriptionId, employeeIds } = data;
    console.log('data for queue', data)
    const client = this.prismaClientManager.getCompanyPrismaClient(companyId);
    for (const employeeId of employeeIds) {
      try {
        await this.assignEmployeeToCourse(
          { employeeId, subscriptionId },
          client,
        );
      } catch (error) {
        continue;
      }
    }

    return;
  }
}
