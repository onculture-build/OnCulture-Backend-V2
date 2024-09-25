import { SeedRunner } from '../../../interfaces';
import { PrismaClient } from '.prisma/company';
import { employmentTypeSeed } from '../company/employment-type.seed';

export default class EmploymentTypeRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    const promises = employmentTypeSeed.map((type) => {
      return this.prisma.employmentType.upsert({
        where: {
          id: type.id,
        },
        create: type,
        update: type,
      });
    });

    return Promise.all(promises);
  }
}
