import { Module } from '@nestjs/common';
import { BaseCountryService } from './base-country.service';
import { BaseCountryController } from './base-country.controller';
import { BaseStateService } from '../base-state/base-state.service';

@Module({
  providers: [BaseCountryService, BaseStateService],
  controllers: [BaseCountryController],
})
export class BaseCountryModule {}
