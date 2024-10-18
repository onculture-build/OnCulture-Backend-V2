import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class EmployeeCourseSubscriptionMapType implements CrudMapType {
  aggregate: Prisma.EmployeeCourseSubscriptionAggregateArgs;
  count: Prisma.EmployeeCourseSubscriptionCountArgs;
  create: Prisma.EmployeeCourseSubscriptionCreateArgs;
  delete: Prisma.EmployeeCourseSubscriptionDeleteArgs;
  deleteMany: Prisma.EmployeeCourseSubscriptionDeleteManyArgs;
  findFirst: Prisma.EmployeeCourseSubscriptionFindFirstArgs;
  findMany: Prisma.EmployeeCourseSubscriptionFindManyArgs;
  findUnique: Prisma.EmployeeCourseSubscriptionFindUniqueArgs;
  update: Prisma.EmployeeCourseSubscriptionUpdateArgs;
  updateMany: Prisma.EmployeeCourseSubscriptionUpdateManyArgs;
  upsert: Prisma.EmployeeCourseSubscriptionUpsertArgs;
}
