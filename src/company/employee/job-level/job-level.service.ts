import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { JobLevelMapType } from './job-level.maptype';
import { CrudService } from '@@/common/database/crud.service';
import { CreateJobLevelDto } from './dto/create-job-level.dto';
import { GetJobLevelsDto } from './dto/get-job-levels.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { RequestWithUser } from '@@/auth/interfaces';
import { UpdateJobLevelDto } from './dto/update-job-level.dto';

@Injectable()
export class JobLevelService extends CrudService<
  CompanyPrisma.JobLevelDelegate,
  JobLevelMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.jobLevel);
  }

  async getAllJobLevels(dto: GetJobLevelsDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parsedQueryFilters = this.parseQueryFilter(filters, ['title']);

    const args: CompanyPrisma.JobLevelFindManyArgs = {
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

  async getJobLevelById(id: string) {
    const jobLevel = await this.findFirst({
      where: { id },
    });

    if (!jobLevel) {
      throw new NotFoundException('Job level not found');
    }

    return jobLevel;
  }

  async createJobLevel(dto: CreateJobLevelDto, req?: RequestWithUser) {
    const existingRank = await this.findFirst({
      where: { rank: dto.rank },
    });

    if (existingRank) {
      throw new ConflictException('Job level with rank already exists');
    }

    return this.create({
      data: {
        ...dto,
        createdBy: req.user.userId,
      },
    });
  }

  async updateJobLevel(
    id: string,
    dto: UpdateJobLevelDto,
    req: RequestWithUser,
  ) {
    return this.update({
      where: { id },
      data: { ...dto, updatedBy: req.user.userId },
    });
  }
}
