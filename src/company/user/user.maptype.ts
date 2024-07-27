import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class CompanyUserMapType implements CrudMapType {
  aggregate: Prisma.CompanyUserAggregateArgs;
  count: Prisma.CompanyUserCountArgs;
  create: Prisma.CompanyUserCreateArgs;
  delete: Prisma.CompanyUserDeleteArgs;
  deleteMany: Prisma.CompanyUserDeleteManyArgs;
  findFirst: Prisma.CompanyUserFindFirstArgs;
  findMany: Prisma.CompanyUserFindManyArgs;
  findUnique: Prisma.CompanyUserFindUniqueArgs;
  update: Prisma.CompanyUserUpdateArgs;
  updateMany: Prisma.CompanyUserUpdateManyArgs;
  upsert: Prisma.CompanyUserUpsertArgs;
}
