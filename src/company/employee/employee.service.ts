import { CrudService } from '@@/common/database/crud.service';
import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CoreEmployeeMaptype } from './employee.maptype';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JobRoleService } from './job-role/job-role.service';

@Injectable()
export class EmployeeService extends CrudService<
  CompanyPrisma.CoreEmployeeDelegate,
  CoreEmployeeMaptype
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private jobRoleService: JobRoleService,
  ) {
    super(prismaClient.coreEmployee);
  }

  async createEmployee({ employeeNo, jobRole }: CreateEmployeeDto) {
    return this.prismaClient.$transaction(
      async (prisma: CompanyPrismaClient) => {
        let employeeJobRole;
        if (jobRole) {
          employeeJobRole = await this.jobRoleService.createJobRole(jobRole);
        }

        return prisma.coreEmployee.create({
          data: {
            employeeNo,
            ...(jobRole && {
              jobRole: { connect: { id: (employeeJobRole as any)?.id } },
            }),
          },
        });
      },
    );
  }
}
