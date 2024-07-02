import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const promises = [];

Promise.all(promises)
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Triza DB seeded successfully');
    await prisma.$disconnect();
  });
