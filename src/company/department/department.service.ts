import { CrudService } from '@@/common/database/crud.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '.prisma/company';
import { DepartmentMaptype } from './department.maptype';
import { GetAllDepartmentsDto } from './dto/get-all-departments.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { RequestWithUser } from '@@/auth/interfaces';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateDepartmentStatusDto } from './dto/update-department-status.dto';

@Injectable()
export class DepartmentService extends CrudService<
  Prisma.DepartmentDelegate,
  DepartmentMaptype
> {
  constructor(private cPrismaClient: PrismaClient) {
    super(cPrismaClient.department);
  }

  async getAllDepartments(dto: GetAllDepartmentsDto) {
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
          manager: {
            firstName: { in: parts, mode: 'insensitive' },
            lastName: { in: parts, mode: 'insensitive' },
          },
        };
      }
      return undefined;
    };

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'name',
      'code',
      'alias',
      {
        key: 'term',
        where: parseSplittedTermsQuery,
      },
    ]);

    const args: Prisma.DepartmentFindManyArgs = {
      where: { ...parsedQueryFilters },
      include: {
        manager: true,
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

  async getDepartmentById(id: string) {
    const department = await this.findFirst({ where: { id } });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async getDepartmentMembers(id: string) {
    const department = await this.findFirst({
      where: { id },
      include: {
        employees: {
          include: {
            employee: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    emails: {
                      where: {
                        isPrimary: true,
                      },
                    },
                  },
                },
                jobRole: true,
              },
            },
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department.employees;
  }

  async createDepartment(
    { managerId, name, ...dto }: CreateDepartmentDto,
    req: RequestWithUser,
  ) {
    let departmentCode = this.generateDepartmentCode(name);

    const departmentWithCode = await this.findFirst({
      where: { code: departmentCode },
    });

    if (departmentWithCode) {
      departmentCode = this.generateDepartmentCode(
        name + '_' + Math.random().toString(36).substring(2, 15),
      );
    }

    let departmentName = name;

    const departmentWithName = await this.findFirst({
      where: { name: { equals: departmentName, mode: 'insensitive' } },
    });

    if (departmentWithName) {
      departmentName = name + '_' + Math.random().toString(36).substring(2, 15);
    }

    return this.create({
      data: {
        name: departmentName,
        code: departmentCode,
        ...dto,
        ...(managerId && { manager: { connect: { id: managerId } } }),
        createdBy: req.user.userId,
      },
    });
  }

  async updateDepartment(
    id: string,
    { managerId, ...dto }: UpdateDepartmentDto,
    req: RequestWithUser,
  ) {
    return this.update({
      where: { id },
      data: {
        ...dto,
        ...(managerId && { manager: { connect: { id: managerId } } }),
        updatedBy: req.user.userId,
      },
    });
  }

  async updateDepartmentStatus(
    id: string,
    { status }: UpdateDepartmentStatusDto,
    req: RequestWithUser,
  ) {
    return this.update({
      where: { id },
      data: {
        status,
        updatedBy: req.user.userId,
      },
    });
  }

  private generateDepartmentCode(name: string) {
    return name.trim().toUpperCase().replace(/\s+/g, '_');
  }
}
