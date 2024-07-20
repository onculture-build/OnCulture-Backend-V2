import { Module } from '@nestjs/common';
import { ShoutOutService } from './shout-out.service';


@Module({
  providers: [ShoutOutService],
})
export class ShoutOutModule {}
