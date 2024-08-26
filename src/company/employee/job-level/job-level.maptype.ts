import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class JobLevelMapType implements CrudMapType {
  aggregate: Prisma.JobLevelAggregateArgs;
  count: Prisma.JobLevelCountArgs;
  create: Prisma.JobLevelCreateArgs;
  delete: Prisma.JobLevelDeleteArgs;
  deleteMany: Prisma.JobLevelDeleteManyArgs;
  findFirst: Prisma.JobLevelFindFirstArgs;
  findMany: Prisma.JobLevelFindManyArgs;
  findUnique: Prisma.JobLevelFindUniqueArgs;
  update: Prisma.JobLevelUpdateArgs;
  updateMany: Prisma.JobLevelUpdateManyArgs;
  upsert: Prisma.JobLevelUpsertArgs;
}
