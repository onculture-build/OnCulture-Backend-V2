import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class UserRolesMapType implements CrudMapType {
  aggregate: Prisma.RoleAggregateArgs;
  count: Prisma.RoleCountArgs;
  create: Prisma.RoleCreateArgs;
  delete: Prisma.RoleDeleteArgs;
  deleteMany: Prisma.RoleDeleteManyArgs;
  findFirst: Prisma.RoleFindFirstArgs;
  findMany: Prisma.RoleFindManyArgs;
  findUnique: Prisma.RoleFindUniqueArgs;
  update: Prisma.RoleUpdateArgs;
  updateMany: Prisma.RoleUpdateManyArgs;
  upsert: Prisma.RoleUpsertArgs;
}
