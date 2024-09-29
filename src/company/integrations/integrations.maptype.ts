import { CrudMapType } from '@@/common/interfaces/crud-maptype.interface';
import { Prisma } from '@@prisma/company';

export class IntegrationMapType implements CrudMapType {
    aggregate: Prisma.IntegrationsConfigAggregateArgs;
    count: Prisma.IntegrationsConfigCountArgs;
    create: Prisma.IntegrationsConfigCreateArgs;
    delete: Prisma.IntegrationsConfigDeleteArgs;
    deleteMany: Prisma.IntegrationsConfigDeleteManyArgs;
    findFirst: Prisma.IntegrationsConfigFindFirstArgs;
    findMany: Prisma.IntegrationsConfigFindManyArgs;
    findUnique: Prisma.IntegrationsConfigFindUniqueArgs;
    update: Prisma.IntegrationsConfigUpdateArgs;
    updateMany: Prisma.IntegrationsConfigUpdateManyArgs;
    upsert: Prisma.IntegrationsConfigUpsertArgs;
}
