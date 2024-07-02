import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

config();

const promises = [];

const prisma = new PrismaClient();

const initDbUrl = process.env.DATABASE_URL;
console.log('---> public schema DB URL ', initDbUrl);

if (String(initDbUrl).indexOf('schema=public') === -1) {
  console.log('---> invalid public schema DB URL', initDbUrl);
  process.exit(1);
}

promises.push(
  new Promise(async (res, rej) => {
    try {
      const companies = await prisma.baseCompany.findMany({
        where: { status: true },
        select: { id: true },
      });
      console.log('---> companies found: ', companies.length);
      for (const { id } of companies) {
        process.env.DATABASE_URL = initDbUrl.replace(
          'schema=public',
          `schema=${id}`,
        );
        console.log('---> applying migration for company... ', id);
        execSync('npm run db.migration.run:company');
        console.log('---> done applying migration for companies... ');
      }
      res(true);
    } catch (error) {
      rej(error);
    }
  }),
);

Promise.all(promises)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => console.log('---> migration script executed successfully!'))
  .finally(async () => {
    process.env.DATABASE_URL = initDbUrl;
    console.log('---> restored DB successfully');
    await prisma.$disconnect();
    console.log('---> DB client disconnected');
  });
