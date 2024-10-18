import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@prisma/client';

export class BaseCourseMapType implements CrudMapType {
  aggregate: Prisma.BaseCourseAggregateArgs;
  count: Prisma.BaseCourseCountArgs;
  create: Prisma.BaseCourseCreateArgs;
  delete: Prisma.BaseCourseDeleteArgs;
  deleteMany: Prisma.BaseCourseDeleteManyArgs;
  findFirst: Prisma.BaseCourseFindFirstArgs;
  findMany: Prisma.BaseCourseFindManyArgs;
  findUnique: Prisma.BaseCourseFindUniqueArgs;
  update: Prisma.BaseCourseUpdateArgs;
  updateMany: Prisma.BaseCourseUpdateManyArgs;
  upsert: Prisma.BaseCourseUpsertArgs;
}
