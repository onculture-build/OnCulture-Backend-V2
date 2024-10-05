import { CrudService } from '@@/common/database/crud.service';
import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { EmploymentTypeMapType } from './employment-type.maptype';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { MapEmploymentTypesOrderByToValue } from '@@/company/interfaces';

@Injectable()
export class EmploymentTypesService extends CrudService<
  CompanyPrisma.EmploymentTypeDelegate,
  EmploymentTypeMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.employmentType);
  }

  async getEmploymentTypes(dto: PaginationSearchOptionsDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parsedQueryFilters = this.parseQueryFilter(filters, ['title']);

    const args = {
      where: { ...parsedQueryFilters },
    };

    return this.findManyPaginate(args, {
      cursor,
      size,
      direction,
      orderBy:
        orderBy &&
        AppUtilities.unflatten({
          [MapEmploymentTypesOrderByToValue[orderBy]]: direction,
        }),
      paginationType,
      page,
    });
  }
}
