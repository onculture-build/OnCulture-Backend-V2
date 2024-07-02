import { PrismaClient } from '.prisma/company';

const companySchema = new PrismaClient();

const promises = [];

Promise.all(promises).catch((e) => {
  console.error(e);
});
