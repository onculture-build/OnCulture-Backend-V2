import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CrudService } from '@@/common/database/crud.service';
import { CoreJobRoleMapType } from './job-role.maptype';
import { CreateJobRoleDto } from './dto/create-job-role.dto';

@Injectable()
export class JobRoleService extends CrudService<
  CompanyPrisma.CoreJobRoleDelegate,
  CoreJobRoleMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.coreJobRole);
  }

  async createJobRole({ jobLevelId, ...dto }: CreateJobRoleDto) {
    const args: CompanyPrisma.CoreJobRoleCreateArgs = {
      data: { ...dto, level: { connect: { id: jobLevelId } } },
    };
    return this.create(args);
  }
}
