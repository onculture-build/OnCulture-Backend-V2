import { CrudService } from '@@/common/database/crud.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { EmployeeMaptype } from './employee.maptype';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JobRoleService } from './job-role/job-role.service';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { UserService } from '../user/user.service';
import { RequestWithUser } from '@@/auth/interfaces';

@Injectable()
export class EmployeeService extends CrudService<
  CompanyPrisma.EmployeeDelegate,
  EmployeeMaptype
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private jobRoleService: JobRoleService,
    private userService: UserService,
  ) {
    super(prismaClient.employee);
  }

  async getAllEmployees(dto: GetEmployeesDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parseSplittedTermsQuery = (term: string) => {
      const parts = term.trim().split(/\s+/);
      if (parts.length > 0) {
        return {
          user: {
            firstName: { in: parts, mode: 'insensitive' },
            lastName: { in: parts, mode: 'insensitive' },
          },
          employeeNo: { in: parts, mode: 'insensitive' },
        };
      }
      return undefined;
    };

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'user.firstName',
      'user.lastName',
      'employeeNo',
      {
        key: 'term',
        where: parseSplittedTermsQuery,
      },
      {
        key: 'departmentId',
        where: (id) => ({
          departments: {
            some: {
              departmentId: {
                equals: id,
              },
              status: true,
            },
          },
        }),
      },
      {
        key: 'jobRoleId',
        where: (id) => ({
          jobRole: { id },
        }),
      },
      {
        key: 'branchId',
        where: (id) => ({
          branch: { id },
        }),
      },
    ]);

    const args: CompanyPrisma.EmployeeFindManyArgs = {
      where: { ...parsedQueryFilters, status: true },
      include: {
        // branch: true,
        user: { include: { emails: true, phones: true } },
        departments: {
          include: { department: true },
          ...(filters.departmentId && {
            where: {
              departmentId: filters.departmentId,
              status: true,
            },
          }),
        },
        jobRole: true,
      },
    };

    return this.findManyPaginate(args, {
      cursor,
      size,
      direction,
      orderBy: orderBy && AppUtilities.unflatten({ [orderBy]: direction }),
      paginationType,
      page,
    });
  }

  async getEmployee(id: string) {
    const dto: CompanyPrisma.EmployeeFindManyArgs = {
      where: { id },
      include: {
        user: {
          include: {
            emails: true,
            phones: true,
            addresses: true,
          },
        },
        departments: {
          where: { status: true },
          include: { department: true },
        },
        jobRole: true,
      },
    };
    return this.findFirstOrThrow(dto);
  }

  async createEmployee(
    { userInfo, ...dto }: CreateEmployeeDto,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma || this.prismaClient;
    return client.$transaction(async (prisma: CompanyPrismaClient) => {
      let employeeJobRole;
      if (dto.jobRole) {
        employeeJobRole = await this.jobRoleService.createJobRole(dto.jobRole);
      }

      const employeeNo = dto.employeeNo
        ? dto.employeeNo
        : await this.generateEmployeeNo(prisma);

      const user = await this.userService.setupCompanyUser(
        { userInfo },
        undefined,
        client,
      );

      return client.employee.create({
        data: {
          employeeNo,
          employmentType: dto.employmentType,
          ...(dto.jobRole && {
            jobRole: { connect: { id: (employeeJobRole as any)?.id } },
          }),
          ...(dto.departmentId && {
            departments: { connect: { id: dto.departmentId, isDefault: true } },
          }),
          user: { connect: { id: user.id } },
          branch: { connect: { id: dto.branchId || req.branchId } },
        },
      });
    });
  }

  private async generateEmployeeNo(prisma: CompanyPrismaClient) {
    let sequence = await prisma.employeeSetting.findFirst({
      where: { status: true },
    });
    if (!sequence || !sequence.status) {
      throw new NotFoundException('No employee settings configured!');
    }
    const data: CompanyPrisma.EmployeeSettingUpdateInput = {
      lastId:
        sequence.start > sequence.lastId ? sequence.start : { increment: 1 },
    };
    sequence = await prisma.employeeSetting.update({
      where: { id: sequence.id },
      data,
    });

    return [
      sequence.prefix,
      String(sequence.lastId).padStart(sequence.length, '0'),
      sequence.suffix,
    ].join('');
  }
}
