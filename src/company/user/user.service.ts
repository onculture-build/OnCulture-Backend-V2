/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
  User,
} from '@@prisma/company';
import { RequestWithUser } from '@@/auth/interfaces';
import { PrismaClient } from '@prisma/client';
import { SetupUserDto } from './dto/setup-user.dto';
import { CompanyUserQueueProducer } from '../queue/producer';
import { CrudService } from '@@/common/database/crud.service';
import { UserMapType } from './user.maptype';
import { UserInfoDto } from '@@/auth/dto/user-info.dto';

@Injectable()
export class UserService extends CrudService<
  CompanyPrisma.UserDelegate,
  UserMapType
> {
  constructor(
    private companyPrismaClient: CompanyPrismaClient,
    private prismaClientManager: PrismaClientManager,
  ) {
    super(companyPrismaClient.user);
  }

  async createUser(
    userInfo: UserInfoDto,
    req: RequestWithUser,
    prisma?: CompanyPrismaClient,
  ) {
    const basePrisma = this.prismaClientManager.getPrismaClient();
    const companyPrisma =
      prisma ??
      (await this.prismaClientManager.getCompanyPrismaClientFromRequest(req));

    return basePrisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.baseUser.create({
        data: {
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName,
          email: userInfo.email.toLowerCase(),
        },
      });

      return this.setupCompanyUser(userInfo, req, companyPrisma);
    });
  }

  async setupCompanyUser(
    userInfo: UserInfoDto,
    authUser?: RequestWithUser,
    prisma?: CompanyPrismaClient,
  ): Promise<User | undefined> {
    const client = prisma || this.companyPrismaClient;

    const {
      roleId,
      email,
      phone,
      phoneCountry,
      stateId,
      countryId,
      ...restUserInfo
    } = userInfo;

    const role = await client.role.findFirst({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotAcceptableException('User assigned role does not exist!');
    }

    const executeSetupUser = async (prisma: CompanyPrismaClient) => {
      const user = await prisma.user.create({
        data: {
          ...restUserInfo,
          createdBy: authUser.user.userId,
          ...(email && {
            emails: { create: { email: email.toLowerCase(), isPrimary: true } },
          }),
          ...(phone && { phones: { create: { phone, isPrimary: true } } }),
          ...(stateId && { state: { connect: { id: stateId } } }),
          ...(countryId && { country: { connect: { id: countryId } } }),
          role: { connect: { id: roleId } },
        },
      });

      return user;
    };

    return prisma
      ? await executeSetupUser(prisma)
      : await client.$transaction(
          async (cPrisma: CompanyPrismaClient) =>
            await executeSetupUser(cPrisma),
        );
  }
}
