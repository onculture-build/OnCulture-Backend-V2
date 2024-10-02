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
import { MapEmployeesOrderByToValue } from '../interfaces';
import { UploadUserPhotoDto } from '../user/dto/upload-user-photo.dto';
import { FileService } from '@@/common/file/file.service';

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
  ) {
    super(prismaClient.employee);
  }

  async getEmployeeFilterFields() {
    const [roles, departments, employmentTypes] = await Promise.all([
      this.getRoles(),
      this.getDepartments(),
      this.getEmploymentTypes(),
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
    const dto: CompanyPrisma.EmployeeFindManyArgs = {
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
        jobRole: {
          include: {
            level: true,
          },
        },
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

  async createEmployee(
    {
      userInfo,
      jobRole,
      jobRoleId,
      employmentType,
      employmentTypeId,
      departmentId,
      ...dto
    }: CreateEmployeeDto,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma || this.prismaClient;
    return client.$transaction(async (prisma: CompanyPrismaClient) => {
      const employeeNo =
        dto.employeeNo ?? (await this.generateEmployeeNo(prisma));

      const user = await this.userService.createUser(userInfo, req, client);

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
      employmentTypeId,
      jobRole,
      jobRoleId,
      ...dto
    }: UpdateEmployeeDto,
    req: RequestWithUser,
  ) {
    const employee = await this.findFirst({
      where: { id },
    });

    if (!employee) throw new NotFoundException('Employee not found!');

    return this.prismaClient.$transaction(
      async (prisma: CompanyPrismaClient) => {
        await this.userService.updateUser(employee.userId, dto, prisma, req);

        return prisma.employee.update({
          where: { id },
          data: {
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
              departments: { connect: { id: departmentId, isDefault: true } },
            }),
            ...(branchId && {
              branch: { connect: { id: branchId || req.branchId } },
            }),
          },
        });
      },
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
}
