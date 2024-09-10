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
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeStatus } from '@@/common/enums';
import { CompanyUserQueueProducer } from '../queue/producer';

@Injectable()
export class EmployeeService extends CrudService<
  CompanyPrisma.EmployeeDelegate,
  EmployeeMaptype
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private jobRoleService: JobRoleService,
    private userService: UserService,
    private companyQueueProducer: CompanyUserQueueProducer,
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
      'jobRole.name|equals',
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
        key: 'employmentType',
        where: (employmentType) => ({ employmentType }),
      },
    ]);

    const args: CompanyPrisma.EmployeeFindManyArgs = {
      where: { ...parsedQueryFilters },
      include: {
        user: { include: { emails: true, phones: true } },
        branch: true,
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

    const dataMapper = (data) => {
      AppUtilities.removeSensitiveData(data.user, 'password', true);
      return data;
    };

    return this.findManyPaginate(
      args,
      {
        cursor,
        size,
        direction,
        orderBy: orderBy && AppUtilities.unflatten({ [orderBy]: direction }),
        paginationType,
        page,
      },
      dataMapper,
    );
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
    const employee = await this.findFirst(dto);

    if (!employee) throw new NotFoundException('Employee not found');

    AppUtilities.removeSensitiveData(employee.user, 'password', true);

    return employee;
  }

  async createEmployee(
    { userInfo, ...dto }: CreateEmployeeDto,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma || this.prismaClient;
    return client.$transaction(async (prisma: CompanyPrismaClient) => {
      let employeeJobRole;
      if (Object.keys(dto.jobRole || {}).length) {
        employeeJobRole = await this.jobRoleService.createJobRole(
          dto.jobRole,
          req,
        );
      }

      const employeeNo =
        dto.employeeNo ?? (await this.generateEmployeeNo(prisma));

      const user = await this.userService.createUser(userInfo, req, client);

      const newEmployee = client.employee.create({
        data: {
          employeeNo,
          employmentType: dto.employmentType,
          ...(dto.jobRole && {
            jobRole: { connect: { id: (employeeJobRole as any)?.id } },
          }),
          ...(dto.departmentId && {
            departments: { connect: { id: dto.departmentId } },
          }),
          status: EmployeeStatus.INACTIVE,
          user: { connect: { id: user.id } },
          branch: { connect: { id: dto.branchId ?? req.user.branchId } },
        },
      });

      if (req && req.user.userId) {
        const token = AppUtilities.encode(
          JSON.stringify({ email: userInfo.email }),
        );

        this.companyQueueProducer.sendEmployeeSetupEmail({
          code: req['company'] as string,
          dto: { email: userInfo.email, ...userInfo },
          token,
        });
      }

      return newEmployee;
    });
  }

  async updateEmployee(
    id: string,
    {
      branchId,
      departmentId,
      employeeNo: _,
      employmentType,
      jobRole,
      jobRoleId,
    }: UpdateEmployeeDto,
    req: RequestWithUser,
  ) {
    let employeeJobRole;
    if (jobRole) {
      employeeJobRole = await this.jobRoleService.createJobRole(jobRole, req);
    }

    return this.update({
      where: { id },
      data: {
        employmentType,
        ...(jobRole && {
          jobRole: { connect: { id: (employeeJobRole as any)?.id } },
        }),
        ...(jobRoleId && {
          jobRole: { connect: { id: jobRoleId } },
        }),
        ...(departmentId && {
          departments: { connect: { id: departmentId, isDefault: true } },
        }),
        ...(branchId && {
          branch: { connect: { id: branchId || req.branchId } },
        }),
      },
    });
  }

  async suspendEmployee(id: string, req: RequestWithUser) {
    return this.update({
      where: { id },
      data: {
        status: EmployeeStatus.SUSPENDED,
        updatedBy: req.user.userId,
      },
    });
  }

  async unsuspendEmployee(id: string, req: RequestWithUser) {
    return this.update({
      where: { id },
      data: {
        status: EmployeeStatus.ACTIVE,
        updatedBy: req.user.userId,
      },
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
