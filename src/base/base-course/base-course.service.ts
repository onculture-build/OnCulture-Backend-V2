import { CrudService } from '@@/common/database/crud.service';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseCourseMapType } from './base-course.maptype';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';

@Injectable()
export class BaseCourseService extends CrudService<
  Prisma.BaseCourseDelegate,
  BaseCourseMapType
> {
  constructor(private prismaClient: PrismaClient) {
    super(prismaClient.baseCourse);
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

    const parsedQueryFilters = this.parseQueryFilter(filters, ['name']);

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
    return this.findFirstOrThrow({
      where: { id },
    });
  }
}
