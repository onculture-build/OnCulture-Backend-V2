import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class CoreJobRoleMapType implements CrudMapType {
  aggregate: Prisma.CoreJobRoleAggregateArgs;
  count: Prisma.CoreJobRoleCountArgs;
  create: Prisma.CoreJobRoleCreateArgs;
  delete: Prisma.CoreJobRoleDeleteArgs;
  deleteMany: Prisma.CoreJobRoleDeleteManyArgs;
  findFirst: Prisma.CoreJobRoleFindFirstArgs;
  findMany: Prisma.CoreJobRoleFindManyArgs;
  findUnique: Prisma.CoreJobRoleFindUniqueArgs;
  update: Prisma.CoreJobRoleUpdateArgs;
  updateMany: Prisma.CoreJobRoleUpdateManyArgs;
  upsert: Prisma.CoreJobRoleUpsertArgs;
}
