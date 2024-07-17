import { Module } from '@nestjs/common';
import { PasswordPolicyModule } from './password-policy/password-policy.module';
import { EmployeeModule } from './employee/employee.module';
import { CompanyService } from './company.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [PasswordPolicyModule, EmployeeModule, UserModule],
  providers: [CompanyService],
  exports: [UserModule],
})
export class CompanyModule {}
