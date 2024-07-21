import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class CoreJobLevelMapType implements CrudMapType {
  aggregate: Prisma.CoreJobLevelAggregateArgs;
  count: Prisma.CoreJobLevelCountArgs;
  create: Prisma.CoreJobLevelCreateArgs;
  delete: Prisma.CoreJobLevelDeleteArgs;
  deleteMany: Prisma.CoreJobLevelDeleteManyArgs;
  findFirst: Prisma.CoreJobLevelFindFirstArgs;
  findMany: Prisma.CoreJobLevelFindManyArgs;
  findUnique: Prisma.CoreJobLevelFindUniqueArgs;
  update: Prisma.CoreJobLevelUpdateArgs;
  updateMany: Prisma.CoreJobLevelUpdateManyArgs;
  upsert: Prisma.CoreJobLevelUpsertArgs;
}
