import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class CoreEmployeeMaptype implements CrudMapType {
  aggregate: Prisma.CoreEmployeeAggregateArgs;
  count: Prisma.CoreEmployeeCountArgs;
  create: Prisma.CoreEmployeeCreateArgs;
  delete: Prisma.CoreEmployeeDeleteArgs;
  deleteMany: Prisma.CoreEmployeeDeleteManyArgs;
  findFirst: Prisma.CoreEmployeeFindFirstArgs;
  findMany: Prisma.CoreEmployeeFindManyArgs;
  findUnique: Prisma.CoreEmployeeFindUniqueArgs;
  update: Prisma.CoreEmployeeUpdateArgs;
  updateMany: Prisma.CoreEmployeeUpdateManyArgs;
  upsert: Prisma.CoreEmployeeUpsertArgs;
}
