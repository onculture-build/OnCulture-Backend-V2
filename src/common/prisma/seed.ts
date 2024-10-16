import { PrismaClient } from '@prisma/client';
import { countrySeed } from '../database/seed-data/base/country.seed';
import { stateSeed } from '../database/seed-data/base/state.seed';
import { baseMessageTemplateSeed } from '../database/seed-data/base/message-template.seed';
import { sanityCoursesSeed } from '../database/seed-data/base/sanity-courses.seed';

const prisma = new PrismaClient();
const promises = [];

promises.push(
  new Promise(async (res, rej) => {
    try {
      // 1. Seed Country Template
      await prisma.baseCountry.createMany({
        data: countrySeed,
        skipDuplicates: true,
      });
      const nga = countrySeed.find((country) => country.iso2 === 'NG');

      // 2. Seed State Template
      await prisma.baseState.createMany({
        data: stateSeed.map((state) => ({
          ...state,
          countryId: nga.id,
        })),
        skipDuplicates: true,
      });
      res(true);
    } catch (e) {
      rej(e);
    }
  }),
);

promises.push(
  prisma.baseMessageTemplate.createMany({
    data: baseMessageTemplateSeed,
    skipDuplicates: true,
  }),
);

promises.push(
  prisma.sanityCourse.createMany({
    data: sanityCoursesSeed,
    skipDuplicates: true,
  }),
);

Promise.all(promises)
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('OnCulture DB seeded successfully');
    await prisma.$disconnect();
  });
