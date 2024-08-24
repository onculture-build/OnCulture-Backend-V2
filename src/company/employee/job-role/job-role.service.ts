import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CrudService } from '@@/common/database/crud.service';
import { JobRoleMapType } from './job-role.maptype';
import { CreateJobRoleDto } from './dto/create-job-role.dto';

@Injectable()
export class JobRoleService extends CrudService<
  CompanyPrisma.JobRoleDelegate,
  JobRoleMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.jobRole);
  }

  async createJobRole({ jobLevelId, ...dto }: CreateJobRoleDto) {
    const args: CompanyPrisma.JobRoleCreateArgs = {
      data: { ...dto, level: { connect: { id: jobLevelId } } },
    };
    return this.create(args);
  }
}
