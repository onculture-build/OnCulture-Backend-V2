import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@prisma/client';

export class SanityCourseMapType implements CrudMapType {
  aggregate: Prisma.SanityCourseAggregateArgs;
  count: Prisma.SanityCourseCountArgs;
  create: Prisma.SanityCourseCreateArgs;
  delete: Prisma.SanityCourseDeleteArgs;
  deleteMany: Prisma.SanityCourseDeleteManyArgs;
  findFirst: Prisma.SanityCourseFindFirstArgs;
  findMany: Prisma.SanityCourseFindManyArgs;
  findUnique: Prisma.SanityCourseFindUniqueArgs;
  update: Prisma.SanityCourseUpdateArgs;
  updateMany: Prisma.SanityCourseUpdateManyArgs;
  upsert: Prisma.SanityCourseUpsertArgs;
}
