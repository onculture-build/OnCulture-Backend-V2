import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class EmployeeMaptype implements CrudMapType {
  aggregate: Prisma.EmployeeAggregateArgs;
  count: Prisma.EmployeeCountArgs;
  create: Prisma.EmployeeCreateArgs;
  delete: Prisma.EmployeeDeleteArgs;
  deleteMany: Prisma.EmployeeDeleteManyArgs;
  findFirst: Prisma.EmployeeFindFirstArgs;
  findMany: Prisma.EmployeeFindManyArgs;
  findUnique: Prisma.EmployeeFindUniqueArgs;
  update: Prisma.EmployeeUpdateArgs;
  updateMany: Prisma.EmployeeUpdateManyArgs;
  upsert: Prisma.EmployeeUpsertArgs;
}
