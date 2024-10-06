import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class EmploymentTypeMapType implements CrudMapType {
  aggregate: Prisma.EmploymentTypeAggregateArgs;
  count: Prisma.EmploymentTypeCountArgs;
  create: Prisma.EmploymentTypeCreateArgs;
  delete: Prisma.EmploymentTypeDeleteArgs;
  deleteMany: Prisma.EmploymentTypeDeleteManyArgs;
  findFirst: Prisma.EmploymentTypeFindFirstArgs;
  findMany: Prisma.EmploymentTypeFindManyArgs;
  findUnique: Prisma.EmploymentTypeFindUniqueArgs;
  update: Prisma.EmploymentTypeUpdateArgs;
  updateMany: Prisma.EmploymentTypeUpdateManyArgs;
  upsert: Prisma.EmploymentTypeUpsertArgs;
}
