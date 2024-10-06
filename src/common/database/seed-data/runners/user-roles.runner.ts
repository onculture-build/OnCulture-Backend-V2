import { SeedRunner } from '../../../interfaces';
import { PrismaClient } from '.prisma/company';
import { roleSeed } from '../company/company-role.seed';

export default class UserRolesRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    const promises = roleSeed.map((role) => {
      return this.prisma.role.upsert({
        where: {
          id: role.id,
        },
        create: role,
        update: role,
      });
    });

    return Promise.all(promises);
  }
}
