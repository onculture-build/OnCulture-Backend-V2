import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class JobRoleMapType implements CrudMapType {
  aggregate: Prisma.JobRoleAggregateArgs;
  count: Prisma.JobRoleCountArgs;
  create: Prisma.JobRoleCreateArgs;
  delete: Prisma.JobRoleDeleteArgs;
  deleteMany: Prisma.JobRoleDeleteManyArgs;
  findFirst: Prisma.JobRoleFindFirstArgs;
  findMany: Prisma.JobRoleFindManyArgs;
  findUnique: Prisma.JobRoleFindUniqueArgs;
  update: Prisma.JobRoleUpdateArgs;
  updateMany: Prisma.JobRoleUpdateManyArgs;
  upsert: Prisma.JobRoleUpsertArgs;
}
