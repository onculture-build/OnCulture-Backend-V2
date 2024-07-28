import { PrismaClient } from '.prisma/company';
import { countrySeed } from '../database/seed-data/base/country.seed';
import { stateSeed } from '../database/seed-data/base/state.seed';
import { roleSeed } from '../database/seed-data/company/company-role.seed';

const companyPrisma = new PrismaClient();

const promises = [];

promises.push(
  new Promise(async (res, rej) => {
    try {
      await companyPrisma.companyCountry.createMany({
        data: countrySeed,
        skipDuplicates: true,
      });
      const nga = countrySeed.find((country) => country.iso2 === 'NG');

      // 2. Seed State Template
      await companyPrisma.companyState.createMany({
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
  companyPrisma.coreRole.createMany({
    data: roleSeed,
    skipDuplicates: true,
  }),
);

Promise.all(promises).catch((e) => {
  console.error(e);
});
