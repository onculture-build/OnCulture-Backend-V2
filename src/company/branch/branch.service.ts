import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClient as CompanyPrismaClient,
  Prisma as CompanyPrisma,
} from '.prisma/company';
import { JwtPayload } from '@@/auth/interfaces';
import { CreateBranchDto } from './dto/create-branch.dto';
import { CrudService } from '@@/common/database/crud.service';
import { BranchMapType } from './branch.maptype';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService extends CrudService<
  CompanyPrisma.CompanyBranchDelegate,
  BranchMapType
> {
  constructor(
    private prismaClient: PrismaClient,
    private companyPrismaClient: CompanyPrismaClient,
  ) {
    super(companyPrismaClient.companyBranch);
  }

  async setupBranch(
    {
      name,
      email,
      phone,
      countryId,
      stateId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      contactId,
      ...item
    }: CreateBranchDto,
    authUser?: JwtPayload,
    prisma?: CompanyPrismaClient,
  ) {
    const client = prisma || this.companyPrismaClient;

    const baseCountry = await this.prismaClient.baseCountry.findFirst({
      where: { id: countryId },
    });
    const baseState = await this.prismaClient.baseState.findFirst({
      where: { id: stateId },
    });

    return client.companyBranch.create({
      data: {
        ...item,
        name,
        email,
        phone,
        createdBy: authUser?.userId,
        country: { connect: { iso2: baseCountry.iso2 } },
        state: { connect: { iso2: baseState.iso2 } },
      },
    });
  }

  async updateBranch(id: string, dto: UpdateBranchDto, authUser: JwtPayload) {
    if (dto.isDefault === true) {
      await this.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const args: CompanyPrisma.CompanyBranchUpdateArgs = {
      where: { id },
      data: {
        ...dto,
        updatedBy: authUser.userId,
      },
    };

    return this.update(args);
  }
}
