import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class BranchMapType implements CrudMapType {
  aggregate: Prisma.CompanyBranchAggregateArgs;
  count: Prisma.CompanyBranchCountArgs;
  create: Prisma.CompanyBranchCreateArgs;
  delete: Prisma.CompanyBranchDeleteArgs;
  deleteMany: Prisma.CompanyBranchDeleteManyArgs;
  findFirst: Prisma.CompanyBranchFindFirstArgs;
  findMany: Prisma.CompanyBranchFindManyArgs;
  findUnique: Prisma.CompanyBranchFindUniqueArgs;
  update: Prisma.CompanyBranchUpdateArgs;
  updateMany: Prisma.CompanyBranchUpdateManyArgs;
  upsert: Prisma.CompanyBranchUpsertArgs;
}
