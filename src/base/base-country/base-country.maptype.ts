import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@prisma/client';

export class BaseCountryMapType implements CrudMapType {
  aggregate: Prisma.BaseCountryAggregateArgs;
  count: Prisma.BaseCountryCountArgs;
  create: Prisma.BaseCountryCreateArgs;
  delete: Prisma.BaseCountryDeleteArgs;
  deleteMany: Prisma.BaseCountryDeleteManyArgs;
  findFirst: Prisma.BaseCountryFindFirstArgs;
  findMany: Prisma.BaseCountryFindManyArgs;
  findUnique: Prisma.BaseCountryFindUniqueArgs;
  update: Prisma.BaseCountryUpdateArgs;
  updateMany: Prisma.BaseCountryUpdateManyArgs;
  upsert: Prisma.BaseCountryUpsertArgs;
}
