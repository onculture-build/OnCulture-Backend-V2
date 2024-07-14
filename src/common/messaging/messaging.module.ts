import { Global, Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { QUEUE } from './interfaces';
import { MailService } from './messaging-mail.service';
import { MailProviderFactory } from './providers/mail-provider-factory';
import { MessagingQueueConsumer } from './queue/consumer';
import { MessagingQueueProducer } from './queue/producer';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('smtp'),
    }),
    BullModule.registerQueue({ name: QUEUE }),
  ],
  providers: [
    MailProviderFactory,
    MailService,
    MessagingQueueConsumer,
    MessagingQueueProducer,
    MessagingService,
  ],
  exports: [BullModule, MailService, MessagingQueueProducer, MessagingService],
})
export class MessagingModule {}
