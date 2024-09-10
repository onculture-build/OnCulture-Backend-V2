import { PrismaClient } from '@prisma/client';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import * as argsParser from 'args-parser';
import { existsSync } from 'fs';
import * as path from 'path';
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

const promises = [];
const prisma = args.company
  ? new CompanyPrismaClient({
      datasources: {
        db: {
          url: String(process.env.DATABASE_URL).replace(
            'schema=public',
            `schema=${args.company}`,
          ),
        },
      },
    })
  : new PrismaClient();

promises.push(
  new Promise(async (res, rej) => {
    try {
      const seedFilePath = path.join(baseDir, `${args['seed-file']}.runner.ts`);
      if (!existsSync(seedFilePath)) {
        throw new Error(`--> seed file '${seedFilePath}' does not exist!`);
      }

      const runner = new (await import(seedFilePath)).default(prisma);
      if (!(runner instanceof SeedRunner)) {
        throw new Error('--> seed file does not contain any runner.');
      }

      await runner.run();

      res(true);
    } catch (error) {
      console.error('Caught error!');
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
  .finally(async () => await prisma.$disconnect());
