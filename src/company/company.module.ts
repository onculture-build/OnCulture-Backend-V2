import { Module } from '@nestjs/common';
import { PasswordPolicyModule } from './password-policy/password-policy.module';
import { EmployeeModule } from './employee/employee.module';
import { CompanyService } from './company.service';
import { UserModule } from './user/user.module';
import { EmployeeService } from './employee/employee.service';
import { JobRoleService } from './employee/job-role/job-role.service';
import { BranchModule } from './branch/branch.module';
import { BranchService } from './branch/branch.service';
import { PermissionModule } from './permission/permission.module';
import { DepartmentModule } from './department/department.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    PasswordPolicyModule,
    EmployeeModule,
    UserModule,
    BranchModule,
    PermissionModule,
    DepartmentModule,
    IntegrationsModule,
    CourseModule,
  ],
  providers: [BranchService, CompanyService, EmployeeService, JobRoleService],
  exports: [BranchModule, CompanyService, EmployeeModule, UserModule],
  controllers: [],
})
export class CompanyModule {}
