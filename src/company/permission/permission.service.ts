import { CrudService } from '@@/common/database/crud.service';
import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '.prisma/company';
import { PermissionMaptype } from './permission.maptype';
import { GetAllPermissionsDto } from './dto/get-all-permissions.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';

@Injectable()
export class PermissionService extends CrudService<
  CompanyPrisma.PermissionDelegate,
  PermissionMaptype
> {
  constructor(private companyPrismaClient: CompanyPrismaClient) {
    super(companyPrismaClient.permission);
  }

  async getAllPermissions(dto: GetAllPermissionsDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'action',
      'subject',
    ]);

    const args: CompanyPrisma.PermissionFindManyArgs = {
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
}
