import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';

@Module({
  providers: [CsvService],
  controllers: [CsvController]
})
export class CsvModule {}
