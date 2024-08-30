import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class DepartmentMaptype implements CrudMapType {
  aggregate: Prisma.DepartmentAggregateArgs;
  count: Prisma.DepartmentCountArgs;
  create: Prisma.DepartmentCreateArgs;
  delete: Prisma.DepartmentDeleteArgs;
  deleteMany: Prisma.DepartmentDeleteManyArgs;
  findFirst: Prisma.DepartmentFindFirstArgs;
  findMany: Prisma.DepartmentFindManyArgs;
  findUnique: Prisma.DepartmentFindUniqueArgs;
  update: Prisma.DepartmentUpdateArgs;
  updateMany: Prisma.DepartmentUpdateManyArgs;
  upsert: Prisma.DepartmentUpsertArgs;
}
