import { PrismaClient } from '@prisma/client';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import argsParser from 'args-parser';
import { existsSync } from 'fs';
import path from 'path';
import { argv } from 'process';
import { SeedRunner } from '../interfaces';

const baseDir = path.join(__dirname, '../database/seed-data/runners');

const args = argsParser(argv);

if (!Object.entries(args).length) {
  console.error('No args passed!');
  process.exit();
}

if (!args['seed-file']) {
  console.error('--seed-file=argument not provided');
  process.exit();
}

const seedFilePath = path.join(baseDir, `${args['seed-file']}.runner.ts`);
if (!existsSync(seedFilePath)) {
  throw new Error(`--> seed file '${seedFilePath}' does not exist!`);
}

const promises = [];
const basePrisma = new PrismaClient();

promises.push(
  new Promise(async (res, rej) => {
    const Runner = new (await import(seedFilePath)).default(basePrisma);

    const runSeeder = async (
      storePrisma: CompanyPrismaClient,
      basePrismaClient?: PrismaClient,
      companyId?: string,
    ) => {
      try {
        const runner = new Runner(storePrisma, basePrismaClient, companyId);
        if (!(runner instanceof SeedRunner)) {
          throw new Error('--> seed file does not contain any runner.');
        }

        await runner.run();
        console.log('---> done running seed');
      } catch (error) {
        console.error('---> caught error! ', error);
        throw error;
      } finally {
        await storePrisma.$disconnect();
        console.log('---> done disconnecting client...');
      }
    };

    const companies = await basePrisma.baseCompany.findMany({
      where: { status: true },
      select: { id: true },
    });

    try {
      for (const { id } of companies) {
        console.log('---> running seed for company: ', id);
        const storePrisma = new CompanyPrismaClient({
          datasources: {
            db: {
              url: String(process.env.DATABASE_URL).replace(
                'schema=public',
                `schema=${id}`,
              ),
            },
          },
        });

        await runSeeder(storePrisma, basePrisma, id);
      }
      res(true);
    } catch (error) {
      rej(error);
    }
  }),
);

Promise.all(promises)
  .catch((e) => {
    console.log('exiting...');
    console.error(e);
    process.exit(1);
  })
  .then(() => console.log('---> custom DB seeding completed successfully!'))
  .finally(async () => await basePrisma.$disconnect());
