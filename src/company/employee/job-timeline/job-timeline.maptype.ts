import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class EmployeeJobTimelineMapType implements CrudMapType {
  aggregate: Prisma.EmployeeJobTimelineAggregateArgs;
  count: Prisma.EmployeeJobTimelineCountArgs;
  create: Prisma.EmployeeJobTimelineCreateArgs;
  delete: Prisma.EmployeeJobTimelineDeleteArgs;
  deleteMany: Prisma.EmployeeJobTimelineDeleteManyArgs;
  findFirst: Prisma.EmployeeJobTimelineFindFirstArgs;
  findMany: Prisma.EmployeeJobTimelineFindManyArgs;
  findUnique: Prisma.EmployeeJobTimelineFindUniqueArgs;
  update: Prisma.EmployeeJobTimelineUpdateArgs;
  updateMany: Prisma.EmployeeJobTimelineUpdateManyArgs;
  upsert: Prisma.EmployeeJobTimelineUpsertArgs;
}
