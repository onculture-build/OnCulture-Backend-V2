import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '.prisma/company';

export class PermissionMaptype implements CrudMapType {
  aggregate: Prisma.PermissionAggregateArgs;
  count: Prisma.PermissionCountArgs;
  create: Prisma.PermissionCreateArgs;
  delete: Prisma.PermissionDeleteArgs;
  deleteMany: Prisma.PermissionDeleteManyArgs;
  findFirst: Prisma.PermissionFindFirstArgs;
  findMany: Prisma.PermissionFindManyArgs;
  findUnique: Prisma.PermissionFindUniqueArgs;
  update: Prisma.PermissionUpdateArgs;
  updateMany: Prisma.PermissionUpdateManyArgs;
  upsert: Prisma.PermissionUpsertArgs;
}
