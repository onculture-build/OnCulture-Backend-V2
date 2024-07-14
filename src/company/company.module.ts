import { Module } from '@nestjs/common';
import { PasswordPolicyModule } from './password-policy/password-policy.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [PasswordPolicyModule, EmployeeModule],
})
export class CompanyModule {}
