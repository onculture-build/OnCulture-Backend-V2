import { Injectable } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CoreJobLevelMapType } from './job-level.maptype';
import { CrudService } from '@@/common/database/crud.service';
import { CreateJobLevelDto } from './dto/create-job-level.dto';

@Injectable()
export class JobLevelService extends CrudService<
  CompanyPrisma.CoreJobLevelDelegate,
  CoreJobLevelMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.coreJobLevel);
  }

  async getAllJobLevels() {
    this.findMany({});
  }

  async createJobLevel(dto: CreateJobLevelDto) {
    return await this.create({ data: dto });
  }
}
