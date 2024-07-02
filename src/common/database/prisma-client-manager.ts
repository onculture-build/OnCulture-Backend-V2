import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { jwtDecode } from 'jwt-decode';
import { RequestWithUser } from '../interfaces';

const defaultSchemaId = '___';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private storePrismaClients: { [key: string]: CompanyPrismaClient } = {};

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

  getStorePrismaClient(storeId?: string): CompanyPrismaClient {
    const schema = storeId || defaultSchemaId;
    let client = this.storePrismaClients[schema];
    if (!client) {
      const databaseUrl = process.env.DATABASE_URL.replace('public', storeId);
      client = new CompanyPrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });

      this.storePrismaClients[schema] = client;
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

  async getStorePrismaClientFromRequest(
    request: RequestWithUser,
  ): Promise<CompanyPrismaClient> {
    const storeId = await this.getCompanySchemaId(request);

    return this.getStorePrismaClient(storeId);
  }

  async initializeStoreSchema(schemaId: string) {
    const initDbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = this.switchSchema(
      process.env.DATABASE_URL,
      schemaId,
    );
    try {
      execSync('npm run db.migration.run:store && npm run db.seed:store');
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
      Object.values(this.storePrismaClients).map((client) =>
        client.$disconnect(),
      ),
    );
  }
}
