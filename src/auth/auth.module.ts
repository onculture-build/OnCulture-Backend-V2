import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BaseCompanyRequestService } from '@@/base/base-company/base-company-request/base-company-request.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BaseCompanyRequestService, JwtService],
})
export class AuthModule {}
