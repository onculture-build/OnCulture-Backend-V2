import { PrismaClient } from '.prisma/client';
import { SeedRunner } from '../../../interfaces';
import { baseMessageTemplateSeed } from '../base/message-template.seed';

export default class BaseMessageTemplateRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    return Promise.all(
      baseMessageTemplateSeed.map((template) =>
        this.prisma.baseMessageTemplate.upsert({
          where: { code: template.code },
          update: { ...template, updatedAt: new Date() },
          create: { ...template, createdAt: new Date() },
        }),
      ),
    );
  }
}
