import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CrudService } from '@@/common/database/crud.service';
import { JobRoleMapType } from './job-role.maptype';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { RequestWithUser } from '@@/auth/interfaces';

@Injectable()
export class JobRoleService extends CrudService<
  CompanyPrisma.JobRoleDelegate,
  JobRoleMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.jobRole);
  }

  async createJobRole(
    { jobLevelId, ...dto }: CreateJobRoleDto,
    req?: RequestWithUser,
  ) {
    const exisitingJobRole = await this.findFirst({
      where: { title: { in: [dto.title], mode: 'insensitive' } },
    });

    if (exisitingJobRole) return exisitingJobRole;

    const args: CompanyPrisma.JobRoleCreateArgs = {
      data: {
        ...dto,
        ...(jobLevelId && { level: { connect: { id: jobLevelId } } }),
        ...(req?.user && { createdBy: req.user.userId }),
      },
    };
    return this.create(args);
  }
}
