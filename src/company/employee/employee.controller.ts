import { AuthStrategyType } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Employee')
@AuthStrategy(AuthStrategyType.JWT)
@ApiBearerAuth()
@Controller('employee')
export class EmployeeController {}
