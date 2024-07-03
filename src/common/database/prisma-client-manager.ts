import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { jwtDecode } from 'jwt-decode';
import { RequestWithUser } from '../interfaces';

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
      const databaseUrl = process.env.DATABASE_URL.replace('public', companyId);
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

  async getCompanySchemaId(req: RequestWithUser) {
    const [, token] = String(req?.headers?.authorization).split(/\s/);

    try {
      const { user: schema } = jwtDecode<RequestWithUser>(token);
      return schema.companyId || defaultSchemaId;
    } catch (e) {
      return;
    }
  }

  async getCompanyPrismaClientFromRequest(
    request: RequestWithUser,
  ): Promise<CompanyPrismaClient> {
    const companyId = await this.getCompanySchemaId(request);

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

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.companyPrismaClients).map((client) =>
        client.$disconnect(),
      ),
    );
  }
}
