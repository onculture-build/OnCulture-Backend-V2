import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from './common/decorators/strategy.decorator';
import { AuthStrategyType } from './auth/interfaces';

@ApiTags('Home')
@AuthStrategy(AuthStrategyType.PUBLIC)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
