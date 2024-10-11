import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CrudService } from '@@/common/database/crud.service';
import { JobRoleMapType } from './job-role.maptype';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { RequestWithUser } from '@@/auth/interfaces';
import { UpdateJobRoleDto } from './dto/update-job-role.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { GetAllJobRolesDto } from './dto/get-job-roles.dto';

@Injectable()
export class JobRoleService extends CrudService<
  CompanyPrisma.JobRoleDelegate,
  JobRoleMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.jobRole);
  }

  async getAllJobRoles(dto: GetAllJobRolesDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parsedQueryFilters = this.parseQueryFilter(filters, ['name']);

    const args: CompanyPrisma.JobRoleFindManyArgs = {
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

  async createJobRole(dto: CreateJobRoleDto, req?: RequestWithUser) {
    const exisitingJobRole = await this.findFirst({
      where: { title: { in: [dto.title], mode: 'insensitive' } },
    });

    if (exisitingJobRole) return exisitingJobRole;

    const args: CompanyPrisma.JobRoleCreateArgs = {
      data: {
        ...dto,
        ...(req?.user && { createdBy: req.user.userId }),
      },
    };

    return this.create(args);
  }

  updateJobRole(id: string, dto: UpdateJobRoleDto, req?: RequestWithUser) {
    return this.update({
      where: { id },
      data: {
        ...dto,
        ...(req?.user && { updatedBy: req.user.userId }),
      },
    });
  }
}
