import { AuthStrategyType } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User & Profile')
@AuthStrategy(AuthStrategyType.JWT)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
}
