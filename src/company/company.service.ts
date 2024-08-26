import { Injectable } from '@nestjs/common';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import { roleSeed } from '@@/common/database/seed-data/company/company-role.seed';
import { SignUpDto } from '@@/auth/dto/signup.dto';
import { BranchService } from './branch/branch.service';
import { EmployeeService } from './employee/employee.service';
import { EmploymentType } from './interfaces';

@Injectable()
export class CompanyService {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private branchService: BranchService,
    private employeeService: EmployeeService,
  ) {}

  async setupCompany(dto: SignUpDto, prisma: CompanyPrismaClient) {
    const client = prisma ?? this.prismaClient;

    const roleId = roleSeed[0].id;

    const employee = await this.employeeService.createEmployee({
      userInfo: { ...dto.userInfo, roleId },
      employmentType: EmploymentType.Fulltime,
    });

    const branch = await this.branchService.setupBranch(
      {
        ...dto.companyInfo,
        isDefault: true,
      },
      undefined,
      client,
    );

    await client.companyUserBranch.create({
      data: {
        userId: employee.userId,
        branchId: branch.id,
      },
    });
  }
}
