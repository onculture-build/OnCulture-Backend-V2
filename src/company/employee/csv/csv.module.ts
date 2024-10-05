import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { CompanyUserQueueProducer } from '@@/company/queue/producer';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '@@/company/interfaces';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE })],
  providers: [CsvService, CompanyUserQueueProducer],
  controllers: [CsvController],
})
export class CsvModule {}
