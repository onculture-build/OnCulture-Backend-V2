import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@prisma/client';

export class BaseStateMapType implements CrudMapType {
  aggregate: Prisma.BaseStateAggregateArgs;
  count: Prisma.BaseStateCountArgs;
  create: Prisma.BaseStateCreateArgs;
  delete: Prisma.BaseStateDeleteArgs;
  deleteMany: Prisma.BaseStateDeleteManyArgs;
  findFirst: Prisma.BaseStateFindFirstArgs;
  findMany: Prisma.BaseStateFindManyArgs;
  findUnique: Prisma.BaseStateFindUniqueArgs;
  update: Prisma.BaseStateUpdateArgs;
  updateMany: Prisma.BaseStateUpdateManyArgs;
  upsert: Prisma.BaseStateUpsertArgs;
}
