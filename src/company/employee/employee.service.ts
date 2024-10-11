import { CrudService } from '@@/common/database/crud.service';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { EmployeeMaptype } from './employee.maptype';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { UserService } from '../user/user.service';
import { RequestWithUser } from '@@/auth/interfaces';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeStatus } from '@@/common/enums';
import { CompanyUserQueueProducer } from '../queue/producer';
import {
  CreateEmployeeIntegration,
  MapEmployeesOrderByToValue,
} from '../interfaces';
import { UploadUserPhotoDto } from '../user/dto/upload-user-photo.dto';
import { FileService } from '@@/common/file/file.service';
import { IntegrationMemberDto } from './dto/create-employee-integration.dto';
import { PrismaClient as BasePrismaClient } from '@prisma/client';
import { PrismaClientManager } from '../../common/database/prisma-client-manager';
import { EmploymentTypesService } from './employment-types/employment-types.service';
import * as moment from 'moment';

@Injectable()
export class EmployeeService extends CrudService<
  CompanyPrisma.EmployeeDelegate,
  EmployeeMaptype
> {
  constructor(
    private prismaClient: CompanyPrismaClient,
    private userService: UserService,
    private companyQueueProducer: CompanyUserQueueProducer,
    private fileService: FileService,
    private basePrismaCLient: BasePrismaClient,
    private prismaClientManager: PrismaClientManager,
    private employmentTypeService: EmploymentTypesService,
  ) {
    super(prismaClient.employee);
  }

  async getEmployeeFilterFields() {
    const [roles, departments, employmentTypes] = await Promise.all([
      this.getRoles(),
      this.getDepartments(),
      this.employmentTypeService.findMany({
        where: { status: true },
        select: {
          id: true,
          title: true,
        },
      }),
    ]);

    return {
      roles,
      departments,
      employmentTypes,
      statuses: Object.values(EmployeeStatus).map((status, idx) => ({
        id: idx,
        name: status,
        isStatus: true,
      })),
    };
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
        key: 'departments',
        where: (ids) => ({
          departments: {
            some: {
              departmentId: {
                in: ids,
              },
              status: true,
            },
          },
        }),
      },
      {
        key: 'roles',
        where: (ids) => ({
          jobRole: { id: { in: ids } },
        }),
      },
      {
        key: 'employmentTypes',
        where: (employmentTypes) => ({
          employmentType: { id: { in: employmentTypes } },
        }),
      },
      {
        key: 'statuses',
        where: (statuses) => ({ status: { in: statuses } }),
      },
    ]);

    const args: CompanyPrisma.EmployeeFindManyArgs = {
      where: { ...parsedQueryFilters },
      include: {
        user: { include: { emails: true, phones: true, photo: true } },
        branch: true,
        departments: {
          include: { department: true },
          ...(filters.departments?.length && {
            where: {
              departmentId: { in: filters.departments },
              status: true,
            },
          }),
        },
        jobRole: true,
        employmentType: true,
      },
    };

    const dataMapper = async (data) => {
      if (data.user.photo) {
        data.user.photo = await this.fileService.getFile(data.user.photo.key);
      }
      AppUtilities.removeSensitiveData(data.user, 'password', true);
      return data;
    };

    return this.findManyPaginate(
      args,
      {
        cursor,
        size,
        direction,
        orderBy:
          orderBy &&
          AppUtilities.unflatten({
            [MapEmployeesOrderByToValue[orderBy]]: direction,
          }),
        paginationType,
        page,
      },
      dataMapper,
    );
  }

  async getEmployee(id: string) {
    const dto: CompanyPrisma.EmployeeFindUniqueArgs = {
      where: { id },
      include: {
        user: {
          include: {
            emails: true,
            phones: true,
            addresses: true,
            photo: true,
            nextOfKin: true,
            emergencyContact: true,
            bank: true,
          },
        },
        departments: {
          where: { status: true },
          include: {
            department: {
              include: {
                manager: {
                  select: {
                    manager: {
                      select: {
                        user: {
                          select: {
                            firstName: true,
                            lastName: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        jobRole: true,
        level: true,
        employmentType: true,
      },
    };
    const employee = await this.findFirst(dto);

    if (!employee) throw new NotFoundException('Employee not found');

    if (employee.user.photo) {
      employee.user.photo = await this.fileService.getFile(
        employee.user.photo.key,
      );
    }

    AppUtilities.removeSensitiveData(employee.user, 'password', true);

    return employee;
  }

  async getEmployeeJobTimeline(id: string) {
    const employee = await this.findUnique({ where: { id } });

    if (!employee) throw new NotFoundException('Employee not found!');

    const timeline = await this.prismaClient.employeeJobTimeline.findMany({
      where: { employeeId: id },
      include: {
        department: true,
        employmentType: true,
        level: true,
        jobRole: true,
      },
    });

    return Promise.all(
      timeline.map(async (tl) => {
        if (tl.managerId) {
          const manager = await this.prismaClient.employee.findFirst({
            where: { id: tl.managerId },
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          });

          if (manager) {
            tl = Object.assign(tl, { manager: manager.user });
          }
          return tl;
        }
        return tl;
      }),
    );
  }

  async createEmployee(
    {
      userInfo,
      jobRole,
      jobRoleId,
      jobLevel,
      jobLevelId,
      employmentType,
      employmentTypeId,
      departmentCode,
      departmentId,
      ...dto
    }: CreateEmployeeDto,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma || this.prismaClient;
    const executeCreateEmployee = async (prisma: CompanyPrismaClient) => {
      const employeeNo =
        dto.employeeNo ?? (await this.generateEmployeeNo(prisma));

      const employeeRole = await client.role.findUnique({
        where: { code: 'employee' },
      });

      const roleId = userInfo.roleId ?? employeeRole?.id;

      const user = await this.userService.createUser(
        { ...userInfo, roleId },
        req,
        prisma,
      );

      const existingEmployee = await prisma.employee.findUnique({
        where: { userId: user.id },
      });

      if (existingEmployee) {
        const { employeeNo: _, ...employeeDto } = dto;
        const obj = {
          jobRole,
          jobRoleId,
          jobLevel,
          jobLevelId,
          employmentType,
          employmentTypeId,
          departmentCode,
          departmentId,
          ...employeeDto,
        };
        return this.updateEmployee(existingEmployee.id, obj, req, prisma);
      }

      const department = departmentCode
        ? await prisma.department.findUnique({
            where: { code: departmentCode.toLowerCase() },
          })
        : departmentId
          ? await prisma.department.findUnique({
              where: { id: departmentId },
            })
          : null;

      const jRole = jobRole
        ? await prisma.jobRole.findFirst({
            where: {
              title: { contains: jobRole.title, mode: 'insensitive' },
            },
          })
        : undefined;

      const newEmployee = await prisma.employee.create({
        data: {
          employeeNo,
          ...(employmentTypeId || employmentType
            ? {
                employmentType: employmentTypeId
                  ? { connect: { id: employmentTypeId } }
                  : { create: employmentType },
              }
            : {}),
          ...(jobRoleId || jobRole
            ? {
                jobRole: jobRoleId
                  ? { connect: { id: jobRoleId } }
                  : { create: jRole ? jobRole : undefined },
              }
            : {}),
          ...(jobLevelId || jobLevel
            ? {
                level: jobLevelId
                  ? { connect: { id: jobLevelId } }
                  : { create: jobLevel },
              }
            : {}),
          ...(department && {
            departments: {
              create: {
                department: { connect: { id: department.id } },
                status: true,
                isDefault: true,
              },
            },
          }),
          status: EmployeeStatus.INACTIVE,
          user: { connect: { id: user.id } },
          ...((dto.branchId || req?.user?.branchId) && {
            branch: { connect: { id: dto.branchId ?? req.user.branchId } },
          }),
        },
      });

      if (req && req?.user?.userId) {
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
    };

    return prisma
      ? await executeCreateEmployee(prisma)
      : await client.$transaction(
          async (cPrisma: CompanyPrismaClient) =>
            await executeCreateEmployee(cPrisma),
        );
  }

  async updateEmployee(
    id: string,
    {
      branchId,
      departmentId,
      departmentCode,
      employeeNo: _,
      employmentType,
      employmentTypeId,
      jobRole,
      jobRoleId,
      jobLevel,
      jobLevelId,
      joinDate,
      exitDate,
      ...dto
    }: UpdateEmployeeDto,
    req: RequestWithUser,
    prisma?: CompanyPrismaClient,
  ) {
    const client = prisma ?? this.prismaClient;
    const employee = await client.employee.findFirst({
      where: { id },
    });

    if (!employee) throw new NotFoundException('Employee not found!');

    const executeUpdateEmployee = async (prisma: CompanyPrismaClient) => {
      await this.userService.updateUser(employee.userId, dto, prisma, req);

      const jRole = jobRole
        ? await prisma.jobRole.findFirst({
            where: {
              title: { contains: jobRole.title, mode: 'insensitive' },
            },
          })
        : undefined;

      const department = departmentCode
        ? await prisma.department.findUnique({
            where: { code: departmentCode.toLowerCase() },
          })
        : departmentId
          ? await prisma.department.findUnique({
              where: { id: departmentId },
            })
          : null;

      return prisma.employee.update({
        where: { id },
        data: {
          ...(joinDate && { joinDate: moment(joinDate).format() }),
          ...(exitDate && { exitDate: moment(exitDate).format() }),
          ...(employmentTypeId || employmentType
            ? {
                employmentType: employmentTypeId
                  ? { connect: { id: employmentTypeId } }
                  : { create: employmentType },
              }
            : {}),
          ...(jobRoleId || jobRole
            ? {
                jobRole: jobRoleId
                  ? { connect: { id: jobRoleId } }
                  : { create: jRole ? jobRole : undefined },
              }
            : {}),
          ...(jobLevelId || jobLevel
            ? {
                level: jobLevelId
                  ? { connect: { id: jobLevelId } }
                  : { create: jobLevel },
              }
            : {}),
          ...(department && {
            departments: {
              upsert: {
                where: {
                  employeeId_departmentId: {
                    employeeId: id,
                    departmentId: department.id,
                  },
                },
                create: {
                  department: { connect: { id: department.id } },
                  status: true,
                  isDefault: true,
                },
                update: {
                  status: true,
                  isDefault: true,
                },
              },
            },
          }),
          ...(branchId && {
            branch: { connect: { id: branchId || req?.user?.branchId } },
          }),
          updatedBy: req?.user?.userId,
        },
      });
    };

    return prisma
      ? await executeUpdateEmployee(prisma)
      : await client.$transaction(
          async (cPrisma: CompanyPrismaClient) =>
            await executeUpdateEmployee(cPrisma),
        );
  }

  async updateEmployeeProfilePicture(
    id: string,
    { photo }: UploadUserPhotoDto,
    req: RequestWithUser,
  ) {
    const { key, eTag } = await this.fileService.uploadFile(
      {
        imageBuffer: photo.buffer,
      },
      photo.originalname.toLowerCase(),
    );

    const employee = await this.prismaClient.employee.findFirst({
      where: { id },
    });

    const updatedUser = await this.prismaClient.user.update({
      where: { id: employee.userId },
      data: {
        photo: {
          upsert: {
            create: {
              key,
              eTag,
              createdBy: req.user.userId,
            },
            update: {
              key,
              eTag,
              updatedBy: req.user.userId,
            },
          },
        },
      },
      include: {
        photo: true,
      },
    });

    return await this.fileService.getFile(updatedUser.photo.key);
  }

  async deactivateEmployee(id: string, req: RequestWithUser) {
    const employee = await this.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            role: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (req.user.userId === employee.userId) {
      throw new BadRequestException('You cannot deactivate yourself!');
    }

    if (employee.user.role.code === 'owner')
      throw new NotAcceptableException('Cannot deactivate an account owner');

    return this.update({
      where: { id },
      data: {
        status: EmployeeStatus.DEACTIVATED,
        updatedBy: req.user.userId,
      },
    });
  }

  async reactivateEmployee(id: string, req: RequestWithUser) {
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

  private async getRoles() {
    return this.prismaClient.jobRole.findMany({
      where: { status: true },
      select: {
        id: true,
        title: true,
      },
    });
  }

  private async getDepartments() {
    return this.prismaClient.department.findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
      },
    });
  }

  private async getEmploymentTypes() {
    return this.prismaClient.employmentType.findMany({
      where: { status: true },
      select: {
        id: true,
        title: true,
      },
    });
  }

  async createEmployeesFromIntegration(payload: CreateEmployeeIntegration) {
    const { dto, branchId, companyId, code } = payload;
    const employeeData: CreateEmployeeDto[] = [];
    for (const member of dto.data) {
      employeeData.push({
        userInfo: {
          firstName: member?.firstName,
          email: member?.email,
          lastName: member?.lastName,
        },
        branchId,
      });
    }
    const client = this.prismaClientManager.getCompanyPrismaClient(companyId);
    return client.$transaction(async (prisma: CompanyPrismaClient) => {
      const results = [];
      for (const employee of employeeData) {
        const {
          userInfo,
          employmentTypeId,
          employmentType,
          jobRole,
          jobRoleId,
          departmentId,
        } = employee;
        const employeeNo =
          employee.employeeNo ?? (await this.generateEmployeeNo(prisma));

        const user = await this.userService.createUser(
          employee.userInfo,
          undefined,
          client,
        );

        if (user) {
          const newEmployee = await client.employee.create({
            data: {
              employeeNo,
              ...(employmentTypeId || employmentType
                ? {
                    employmentType: employmentTypeId
                      ? { connect: { id: employmentTypeId } }
                      : { create: employmentType },
                  }
                : {}),
              ...(jobRoleId || jobRole
                ? {
                    jobRole: jobRoleId
                      ? { connect: { id: jobRoleId } }
                      : { create: jobRole },
                  }
                : {}),
              ...(departmentId && {
                departments: { connect: { id: departmentId } },
              }),
              status: EmployeeStatus.INACTIVE,
              user: { connect: { id: user.id } },
              branch: { connect: { id: branchId } },
            },
          });

          const token = AppUtilities.encode(
            JSON.stringify({ email: userInfo.email }),
          );

          this.companyQueueProducer.sendEmployeeSetupEmail({
            code,
            dto: { email: userInfo.email, ...userInfo },
            token,
          });

          results.push(newEmployee);
        }
      }

      return results;
    });
  }

  async enqueueEmployeeCreation(
    payload: IntegrationMemberDto,
    req: RequestWithUser,
  ) {
    const { code } = payload;
    const company = await this.basePrismaCLient.baseCompany.findUnique({
      where: {
        code: payload['code'],
      },
    });
    return await this.companyQueueProducer.inviteEmployeeToCompany({
      dto: payload,
      companyId: company?.id,
      code,
      branchId: req?.user?.branchId,
    });
  }
}
