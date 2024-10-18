import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
} from '@@prisma/company';
import { CrudService } from '@@/common/database/crud.service';
import { EmployeeJobTimelineMapType } from './job-timeline.maptype';
import { CreateJobTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { RequestWithUser } from '@@/auth/interfaces';
import * as moment from 'moment';

@Injectable()
export class JobTimelineService extends CrudService<
  CompanyPrisma.EmployeeJobTimelineDelegate,
  EmployeeJobTimelineMapType
> {
  constructor(private prismaClient: CompanyPrismaClient) {
    super(prismaClient.employeeJobTimeline);
  }

  async getAllTimelines() {
    return this.findMany({});
  }

  async getTimeline(id: string) {
    const tl = await this.findUnique({
      where: { id },
      include: {
        department: true,
        employmentType: true,
        jobRole: true,
        level: true,
      },
    });

    if (!tl) throw new NotFoundException('Job timeline not found!');

    return tl;
  }

  async createTimeline(
    { promotionDate, ...dto }: CreateJobTimelineDto,
    req: RequestWithUser,
  ) {
    const args: CompanyPrisma.EmployeeJobTimelineCreateArgs = {
      data: {
        promotionDate: moment(promotionDate).format(),
        ...dto,
        createdBy: req.user?.userId,
      },
    };

    return this.create(args);
  }

  async updateTimeline(
    id: string,
    { employeeId: _, ...dto }: UpdateTimelineDto,
    req: RequestWithUser,
  ) {
    const timeline = await this.findUnique({ where: { id } });

    if (!timeline) throw new NotFoundException('Job timeline not found!');

    return this.update({
      where: { id },
      data: { ...dto, updatedBy: req.user?.userId },
    });
  }
}
