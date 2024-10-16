import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SanityCourseMapType } from './sanity.maptype';
import { CrudService } from '@@/common/database/crud.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { SanityProviderService } from '@@/common/third-party/providers/sanity/sanity.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { RequestWithUser } from '@@/auth/interfaces';
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';

@Injectable()
export class SanityService extends CrudService<
  Prisma.SanityCourseDelegate,
  SanityCourseMapType
> {
  constructor(
    private prismaClient: PrismaClient,
    private prismaClientManager: PrismaClientManager,
    private sanityProvider: SanityProviderService,
  ) {
    super(prismaClient.sanityCourse);
  }

  async getAllCourses(query: PaginationSearchOptionsDto) {
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

    const args: Prisma.BaseCompanyFindManyArgs = {
      where: { ...parsedQueryFilters },
    };

    return this.findManyPaginate(args, {
      cursor,
      size,
      direction,
      orderBy: orderBy && AppUtilities.unflatten({ [orderBy]: direction }),
      paginationType,
      page,
    });
  }

  async getCourse(id: string) {
    const course = this.findFirst({
      where: { id },
    });

    if (!course) throw new NotFoundException('Course is not found!');

    return course;
  }

  async subscribeToCourse(id: string, req: RequestWithUser) {
    const course = await this.getCourse(id);

    const company = await this.prismaClient.baseCompany.findFirst({
      where: { code: req['company'] },
    });

    const existingSub =
      await this.prismaClient.sanityCourseSubscription.findUnique({
        where: {
          courseId_companyId: {
            courseId: course.id,
            companyId: company.id,
          },
        },
      });

    if (existingSub)
      throw new BadRequestException(
        'Cannot subscribe to existing subscription',
      );

    const clientPrisma = this.prismaClientManager.getCompanyPrismaClient(
      company.id,
    );

    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const subscription = await prisma.sanityCourseSubscription.create({
        data: {
          course: { connect: { id: course.id } },
          companyId: company.id,
        },
      });

      try {
        await clientPrisma.courseSubscription.create({
          data: {
            subscriptionId: subscription.id,
            isSanityCourse: true,
          },
        });
      } catch (error) {
        console.error('Error subscribing:', error.message);
        await prisma.sanityCourseSubscription.delete({
          where: { id: subscription.id },
        });

        throw new ServiceUnavailableException('Unable to subscribe to course');
      }
    });
  }
}
