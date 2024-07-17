import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@prisma/client';

export class BaseCompanyMaptype implements CrudMapType {
  aggregate: Prisma.BaseCompanyAggregateArgs;
  count: Prisma.BaseCompanyCountArgs;
  create: Prisma.BaseCompanyCreateArgs;
  delete: Prisma.BaseCompanyDeleteArgs;
  deleteMany: Prisma.BaseCompanyDeleteManyArgs;
  findFirst: Prisma.BaseCompanyFindFirstArgs;
  findMany: Prisma.BaseCompanyFindManyArgs;
  findUnique: Prisma.BaseCompanyFindUniqueArgs;
  update: Prisma.BaseCompanyUpdateArgs;
  updateMany: Prisma.BaseCompanyUpdateManyArgs;
  upsert: Prisma.BaseCompanyUpsertArgs;
}
