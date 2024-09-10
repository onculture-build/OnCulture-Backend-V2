import { MessageType, SeedRunner } from '../../../interfaces';
import { PrismaClient } from '.prisma/company';
import { messageTemplateSeed } from '../company/message-template.seed';

export default class CoreServiceItemRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    const promises = messageTemplateSeed.map((messageTemplate) => {
      return this.prisma.messageTemplate.upsert({
        where: {
          name_type: { name: messageTemplate.name, type: MessageType.Email },
        },
        create: messageTemplate,
        update: messageTemplate,
      });
    });

    return Promise.all(promises);
  }
}
