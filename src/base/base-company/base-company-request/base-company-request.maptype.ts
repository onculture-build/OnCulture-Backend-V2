import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@prisma/client';

export class BaseCompanyRequestMapType implements CrudMapType {
  aggregate: Prisma.BaseCompanyRequestAggregateArgs;
  count: Prisma.BaseCompanyRequestCountArgs;
  create: Prisma.BaseCompanyRequestCreateArgs;
  delete: Prisma.BaseCompanyRequestDeleteArgs;
  deleteMany: Prisma.BaseCompanyRequestDeleteManyArgs;
  findFirst: Prisma.BaseCompanyRequestFindFirstArgs;
  findMany: Prisma.BaseCompanyRequestFindManyArgs;
  findUnique: Prisma.BaseCompanyRequestFindUniqueArgs;
  update: Prisma.BaseCompanyRequestUpdateArgs;
  updateMany: Prisma.BaseCompanyRequestUpdateManyArgs;
  upsert: Prisma.BaseCompanyRequestUpsertArgs;
}
