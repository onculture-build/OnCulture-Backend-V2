import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import { FactoryProvider, Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaClientManager } from './prisma-client-manager';
import { PrismaService } from './prisma/prisma.service';
import { RequestWithUser } from '@@/auth/interfaces';

const companyPrismaClientProvider: FactoryProvider<
  Promise<CompanyPrismaClient>
> = {
  provide: CompanyPrismaClient,
  scope: Scope.REQUEST,
  inject: [REQUEST, PrismaClientManager],
  useFactory: async (
    request: RequestWithUser,
    manager: PrismaClientManager,
  ) => {
    return manager.getCompanyPrismaClientFromRequest(request);
  },
};

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaClient,
    PrismaService,
    PrismaClientManager,
    companyPrismaClientProvider,
  ],
  exports: [
    PrismaClient,
    PrismaService,
    PrismaClientManager,
    companyPrismaClientProvider,
  ],
})
export class DatabaseModule {}
