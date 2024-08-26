import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY_KEY } from '../../common/decorators/strategy.decorator';
import { AuthStrategyType } from '../interfaces';

@Injectable()
export class AppGuard extends AuthGuard(['jwt']) {
  constructor(protected reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext) {
    const [authStrategy] =
      this.reflector.getAllAndOverride<AuthStrategyType>(AUTH_STRATEGY_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!authStrategy) {
      return false;
    }

    switch (authStrategy) {
      case AuthStrategyType.PUBLIC:
        return true;
      default:
        return super.canActivate(context);
    }
  }
}
