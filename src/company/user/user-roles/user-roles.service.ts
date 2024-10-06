import { Injectable } from '@nestjs/common';
import { CrudService } from '@@/common/database/crud.service';
import { UserRolesMapType } from './user-roles.maptype';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { MapRolesOrderByToValue } from '@@/company/interfaces';

@Injectable()
export class UserRolesService extends CrudService<
  CompanyPrisma.RoleDelegate,
  UserRolesMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.role);
  }

  async getUserRoles(dto: PaginationSearchOptionsDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parsedQueryFilters = this.parseQueryFilter(filters, ['name']);

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
          [MapRolesOrderByToValue[orderBy]]: direction,
        }),
      paginationType,
      page,
    });
  }
}
