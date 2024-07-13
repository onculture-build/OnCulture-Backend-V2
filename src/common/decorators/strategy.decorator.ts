import { AuthStrategyType } from '@@/auth/interfaces';
import { SetMetadata } from '@nestjs/common';

export const AUTH_STRATEGY_KEY = '$__authStrategyKey';

export const AuthStrategy = (
  strategy: AuthStrategyType = AuthStrategyType.JWT,
  authGroups?: string[],
) => SetMetadata(AUTH_STRATEGY_KEY, [strategy, authGroups]);
