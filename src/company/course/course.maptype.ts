import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class CourseSubscriptionMapType implements CrudMapType {
  aggregate: Prisma.CourseSubscriptionAggregateArgs;
  count: Prisma.CourseSubscriptionCountArgs;
  create: Prisma.CourseSubscriptionCreateArgs;
  delete: Prisma.CourseSubscriptionDeleteArgs;
  deleteMany: Prisma.CourseSubscriptionDeleteManyArgs;
  findFirst: Prisma.CourseSubscriptionFindFirstArgs;
  findMany: Prisma.CourseSubscriptionFindManyArgs;
  findUnique: Prisma.CourseSubscriptionFindUniqueArgs;
  update: Prisma.CourseSubscriptionUpdateArgs;
  updateMany: Prisma.CourseSubscriptionUpdateManyArgs;
  upsert: Prisma.CourseSubscriptionUpsertArgs;
}
