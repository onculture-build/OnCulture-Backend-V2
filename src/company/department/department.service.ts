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

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'name',
      'code',
      'alias',
      {
        key: 'managerId',
        where: (val) => ({ managerId: val }),
      },
    ]);

    const args: Prisma.DepartmentFindManyArgs = {
      where: { ...parsedQueryFilters },
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
    { managerId, ...dto }: CreateDepartmentDto,
    req: RequestWithUser,
  ) {
    return this.create({
      data: {
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
}
