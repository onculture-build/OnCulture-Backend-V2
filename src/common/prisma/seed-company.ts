import { PrismaClient } from '.prisma/company';
import { countrySeed } from '../database/seed-data/base/country.seed';
import { stateSeed } from '../database/seed-data/base/state.seed';
import { roleSeed } from '../database/seed-data/company/company-role.seed';
import { employeeSettingSeed } from '../database/seed-data/company/employee-setting.seed';
import { messageTemplateSeed } from '../database/seed-data/company/message-template.seed';
import { employmentTypeSeed } from '../database/seed-data/company/employment-type.seed';

const companyPrisma = new PrismaClient();

const promises = [];

promises.push(
  new Promise(async (res, rej) => {
    try {
      await companyPrisma.country.createMany({
        data: countrySeed,
        skipDuplicates: true,
      });
      const nga = countrySeed.find((country) => country.iso2 === 'NG');

      // 2. Seed State Template
      await companyPrisma.state.createMany({
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
  companyPrisma.role.createMany({
    data: roleSeed,
    skipDuplicates: true,
  }),
);

promises.push(
  companyPrisma.employeeSetting.create({
    data: employeeSettingSeed,
  }),
);

promises.push(
  companyPrisma.messageTemplate.createMany({
    data: messageTemplateSeed,
    skipDuplicates: true,
  }),
);

promises.push(
  companyPrisma.employmentType.createMany({
    data: employmentTypeSeed,
    skipDuplicates: true,
  }),
);

Promise.all(promises).catch((e) => {
  console.error(e);
});
