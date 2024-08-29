import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BaseCompanyRequestService } from '@@/base/base-company/base-company-request/base-company-request.service';
import { BaseCompanyService } from '@@/base/base-company/base-company.service';
import { BaseCompanyModule } from '@@/base/base-company/base-company.module';
import { CompanyModule } from '@@/company/company.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [BaseCompanyModule, CompanyModule, CaslModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    BaseCompanyService,
    BaseCompanyRequestService,
    JwtService,
  ],
})
export class AuthModule {}
