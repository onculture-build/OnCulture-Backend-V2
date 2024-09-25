/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaClient as CompanyPrismaClient } from '.prisma/company';
import { roleSeed } from '@@/common/database/seed-data/company/company-role.seed';
import { SignUpDto } from '@@/auth/dto/signup.dto';
import { BranchService } from './branch/branch.service';
import { EmployeeService } from './employee/employee.service';
import { RequestWithUser } from '@@/auth/interfaces';
import { employmentTypeSeed } from '@@/common/database/seed-data/company/employment-type.seed';

@Injectable()
export class CompanyService {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private branchService: BranchService,
    private employeeService: EmployeeService,
  ) {}

  async setupCompany(
    { userInfo, companyInfo }: SignUpDto,
    prisma: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma ?? this.prismaClient;

    const roleId = roleSeed[0].id;
    const employmentTypeId = employmentTypeSeed[0].id;

    const { code, mission, vision, values, ...rest } = companyInfo;

    const branch = await this.branchService.setupBranch(
      {
        ...rest,
        isDefault: true,
      },
      undefined,
      client,
    );

    const employee = await this.employeeService.createEmployee(
      {
        userInfo: { ...userInfo, roleId },
        employmentTypeId,
        branchId: branch.id,
      },
      client,
      req,
    );

    await client.companyUserBranch.create({
      data: {
        userId: employee.userId,
        branchId: branch.id,
      },
    });
  }
}
