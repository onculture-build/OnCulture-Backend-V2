import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../interfaces';
import { CompanyUserQueueConsumer } from '../queue/consumer';
import { CompanyUserQueueProducer } from '../queue/producer';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE })],
  providers: [UserService, CompanyUserQueueProducer, CompanyUserQueueConsumer],
  exports: [UserService, CompanyUserQueueProducer, CompanyUserQueueConsumer],
})
export class UserModule {}
