import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { RequestWithUser } from '@@/auth/interfaces';

const defaultSchemaId = '___';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private companyPrismaClients: { [key: string]: CompanyPrismaClient } = {};

  private prismaClient: PrismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  getPrismaClient(): PrismaClient {
    return this.prismaClient;
  }

  getCompanyPrismaClient(companyId?: string): CompanyPrismaClient {
    const schema = companyId || defaultSchemaId;
    let client = this.companyPrismaClients[schema];
    if (!client) {
      const databaseUrl = process.env.DATABASE_URL.replace('public', schema);
      client = new CompanyPrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });

      this.companyPrismaClients[schema] = client;
    }

    return client;
  }

  async getCompanyPrismaClientFromRequest(
    request: RequestWithUser,
  ): Promise<CompanyPrismaClient> {
    const companyId = await this.getCompanyIdFromSubdomain(request);

    if (!companyId) {
      return this.getCompanyPrismaClient();
    }

    return this.getCompanyPrismaClient(companyId);
  }

  async initializeCompanySchema(schemaId: string) {
    const initDbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = this.switchSchema(
      process.env.DATABASE_URL,
      schemaId,
    );
    try {
      execSync('npm run db.migration.run:company && npm run db.seed:company');
    } finally {
      process.env.DATABASE_URL = initDbUrl;
    }
  }

  private switchSchema(dbUrl: string, schema: string): string {
    const switchedUrl = dbUrl.split('?');
    return `${switchedUrl[0]}?schema=${schema}`;
  }

  private async getCompanyIdFromSubdomain(
    req: RequestWithUser,
  ): Promise<string> {
    const companyCode = (req['company'] as string) || '';

    const company = await this.prismaClient.baseCompany.findUnique({
      where: { code: companyCode },
    });

    return company?.id;
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.companyPrismaClients).map((client) =>
        client.$disconnect(),
      ),
    );
  }
}
