import { Injectable, NotFoundException } from '@nestjs/common';
import { SanityCourseMapType } from './sanity.maptype';
import { CrudService } from '@@/common/database/crud.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { SanityProviderService } from '@@/common/third-party/providers/sanity/sanity.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';

@Injectable()
export class SanityService extends CrudService<
  Prisma.SanityCourseDelegate,
  SanityCourseMapType
> {
  constructor(
    private prismaClient: PrismaClient,
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
}
