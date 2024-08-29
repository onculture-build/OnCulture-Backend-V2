import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CaslModule } from '@@/auth/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
