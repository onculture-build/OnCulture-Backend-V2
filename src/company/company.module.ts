import { Module } from '@nestjs/common';
import { PasswordPolicyModule } from './password-policy/password-policy.module';
import { EmployeeModule } from './employee/employee.module';
import { CompanyService } from './company.service';
import { UserModule } from './user/user.module';
import { EmployeeService } from './employee/employee.service';
import { JobRoleService } from './employee/job-role/job-role.service';
import { BranchModule } from './branch/branch.module';
import { BranchService } from './branch/branch.service';

@Module({
  imports: [PasswordPolicyModule, EmployeeModule, UserModule, BranchModule],
  providers: [BranchService, CompanyService, EmployeeService, JobRoleService],
  exports: [BranchModule, CompanyService, EmployeeModule, UserModule],
})
export class CompanyModule {}
