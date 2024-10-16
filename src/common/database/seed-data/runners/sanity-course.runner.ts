import { PrismaClient } from '.prisma/client';
import { SeedRunner } from '../../../interfaces';
import { sanityCoursesSeed } from '../base/sanity-courses.seed';

export default class BaseMessageTemplateRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    return Promise.all(
      sanityCoursesSeed.map((course) =>
        this.prisma.sanityCourse.upsert({
          where: { sanityId: course.sanityId },
          update: { ...course, updatedAt: new Date() },
          create: { ...course, createdAt: new Date() },
        }),
      ),
    );
  }
}
