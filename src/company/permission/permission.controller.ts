import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { GetAllPermissionsDto } from './dto/get-all-permissions.dto';
import { AuthStrategyType, PermissionAction } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { PermissionsGuard } from '@@/auth/guard/permission.guard';
import { CheckPermissions } from '@@/common/decorators/permission.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@UseGuards(PermissionsGuard)
@CheckPermissions([PermissionAction.READ, 'permission'])
@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  async getAllPermissions(@Query() query: GetAllPermissionsDto) {
    return this.permissionService.getAllPermissions(query);
  }
}
